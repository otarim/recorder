'use strict'
var app = require('app')
var BrowserWindow = require('browser-window')
var electron = require('electron')
var Menu = require("menu")
var ipcMain = electron.ipcMain,
  dialog = electron.dialog,
  fs = require('mz/fs'),
  mkdir = require("mkdir-promise"),
  path = require('path'),
  co = require('co'),
  trimHtml = require('trim-html'),
  striptags = require('striptags')

const dbPath = path.resolve(__dirname, './db')

const ignoreExtname = ['.DS_Store', '.git', '.idea', '.gitkeep']

var mainWindow = null

app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit()
  }
})

app.on('ready', function() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 650,
    minWidth: 1024,
    minHeight: 650,
    center: true
  })

  mainWindow.loadURL('file://' + __dirname + '/index.html')

  mainWindow.on('closed', function() {
    mainWindow = null
  })

  ipcMain.on('posts.list.get', function(evt) {
    co(function*() {
      try {
        var list = []
        yield walk(dbPath, list, wrapFile)
        evt.sender.send('getList', list)
      } catch (err) {
        showError(err.message)
      }
    }).catch(function(err) {
      showError(err.message)
    })
  })

  ipcMain.on('post.save', function(evt, data) {
    co(function*() {
      var pathname = String(Date.now())
      if (data.title && data.text) {
        var filename = path.join(dbPath, pathname + '/' + data.title + '.html')
        try {
          var exists = yield fs.exists(filename)
          if (exists) {
            showError('file exists')
          } else {
            yield mkdir(path.join(dbPath, pathname))
            yield fs.writeFile(filename, data.text)
            evt.sender.send('post.saved', yield wrapFile(filename))
          }
        } catch (err) {
          showError(err.message)
        }
      } else {
        showError('标题或者内容为空')
      }
    }).catch(function(err) {
      showError(err.message)
    })
  })

  ipcMain.on('post.get', function(evt, file) {
    co(function*() {
      try {
        var content = yield fs.readFile(file)
        evt.sender.send('post.geted', yield wrapFile(file, {
          content: content.toString()
        }))
      } catch (err) {
        showError(err.message)
      }
    }).catch(function(err) {
      showError(err.message)
    })
  })

  ipcMain.on('posts.search', function(evt, query) {
    // search title
    // search content
    co(function*() {
      try {
        var list = []
        if (!query.trim()) {
          yield walk(dbPath, list, wrapFile)
        } else {
          yield walk(dbPath, list, function*(file) {
            var filename = path.basename(file)
            if (file.match(query)) {
              return yield wrapFile(file)
            } else {
              var content = yield fs.readFile(file)
              if (content.toString().indexOf(query) !== -1) {
                return yield wrapFile(file)
              } else {
                return false
              }
            }
            return false
          })
        }
        evt.sender.send('posts.search.result', list)
      } catch (err) {
        showError(err.message)
      }
    }).catch(function(err) {
      showError(err.message)
    })
  })

  ipcMain.on('post.remove', function(evt, data) {
    co(function*() {
      var filename = data.filename,
        index = data.index
      try {
        var exists = yield fs.exists(filename)
        if (!exists) {
          showError('file not exists')
        } else {
          let pathname = path.dirname(filename)
          yield fs.unlink(filename)
          yield fs.rmdir(pathname)
          evt.sender.send('post.removed', index)
        }
      } catch (err) {
        showError(err.message)
      }
    }).catch(function(err) {
      showError(err.message)
    })
  })

  // https://pracucci.com/atom-electron-enable-copy-and-paste.html
  var template = [{
    label: "Application",
    submenu: [{
      label: "About Application",
      selector: "orderFrontStandardAboutPanel:"
    }, {
      type: "separator"
    }, {
      label: "Quit",
      accelerator: "Command+Q",
      click: function() {
        app.quit()
      }
    }]
  }, {
    label: "Edit",
    submenu: [{
      label: "Undo",
      accelerator: "CmdOrCtrl+Z",
      selector: "undo:"
    }, {
      label: "Redo",
      accelerator: "Shift+CmdOrCtrl+Z",
      selector: "redo:"
    }, {
      type: "separator"
    }, {
      label: "Cut",
      accelerator: "CmdOrCtrl+X",
      selector: "cut:"
    }, {
      label: "Copy",
      accelerator: "CmdOrCtrl+C",
      selector: "copy:"
    }, {
      label: "Paste",
      accelerator: "CmdOrCtrl+V",
      selector: "paste:"
    }, {
      label: "Select All",
      accelerator: "CmdOrCtrl+A",
      selector: "selectAll:"
    }]
  }]

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
})

var walk = function*(dir, ret, cb) {
  var files = yield fs.readdir(dir)
  for (var i = 0, l = files.length; i < l; i++) {
    if (ignoreExtname.some(function(ext) {
        return files[i] === ext
      })) {
      continue
    } else {
      var file = path.join(dir, files[i]),
        stat = yield fs.stat(file)

      if (stat.isDirectory()) {
        yield walk(file, ret, cb)
      } else {
        // ignore
        if (cb) {
          let result = yield cb(file)
          if (result === false) {
            continue
          } else {
            ret.push(result)
          }
        }
      }
    }
  }
}

var showError = function(content) {
  dialog.showErrorBox('警告', content)
}

var wrapFile = function*(file, extra) {
  var content = yield fs.readFile(file),
    stat = yield fs.stat(file),
    imgs = content.toString().match(/< *[img][^\\>]*[src] *= *[\\"\\']{0,1}([^\\"\\'\\ >]*)/)
  var ret = {
    title: path.basename(file),
    postDate: stat.ctime,
    shortContent: striptags(trimHtml(content.toString(), {
      limit: 140
    }).html),
    hasImage: imgs ? imgs[1] : false,
    file
  }
  if (extra) {
    Object.assign(ret, extra)
  }
  return ret
}