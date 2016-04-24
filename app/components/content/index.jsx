var React = require('react')
var Editor = require('../editor/index.jsx'),
	EditorTitle = require('../editorTitle/index.jsx'),
	List = require('../list/index.jsx'),
	Modal = require('../modal/index.jsx'),
	Search = require('../search/index.jsx'),
	Post = require('../Post/index.jsx'),
	ipcRenderer = window.require('electron').ipcRenderer,
	dialog = window.require('electron').dialog


var Content = React.createClass({
	getInitialState() {
	    return {
	    	text: '',
	    	data: [],
	    	text: '',
	    	options: {
					toolbar: {
						buttons: ['bold', 'italic', 'underline', 'strikethrough','pre','anchor', 'justifyLeft','justifyCenter','justifyRight','quote','image','orderedlist','unorderedlist','removeFormat'],
					}
				},
				loading: true,
				writing: false,
				source: null   
	    }
	},
	componentDidMount: function() {
		ipcRenderer.send('posts.list.get')
		ipcRenderer.on('getList',function(evt,data){
			console.log(data)
			this.setState({
				data,
				loading: false
			})
		}.bind(this))
		ipcRenderer.on('post.saved',function(evt,data){
			this.state.data.push(data)
			this.setState({
				data: this.state.data
			})
			this.closePostHandler()
		}.bind(this))
		ipcRenderer.on('posts.search.result',function(evt,data){
			this.setState({
				data,
				loading: false
			})
		}.bind(this))
		ipcRenderer.on('post.removed',function(evt,index){
			this.setState({
				data: this.state.data.filter(function(_,i){
					return i !== index
				})
			})
		}.bind(this))
		ipcRenderer.on('post.geted',function(evt,source){
			this.setState({
				source
			})
		}.bind(this))
	},
	render: function() {
		var {loading,writing,text,options,source} = this.state
		return (
			<div className="page">
				<Search onSearch={this.searchHandler}></Search>
				<List 
					data={this.state.data}
					fetching={loading}
					onRemove={this.removeHandler}
					onView={this.viewHandler}
				/>
				<button className="btn btn-primary btn-lg" onClick={this.openPostHandler}>添加记录</button>
				<Modal
					show={writing}
					title="撰写"
					onClose={this.closePostHandler}
					onConfirm={this.postHandler}
					>
					<EditorTitle
						onChange={this.setTitleHandler}
					>
					</EditorTitle>
					<Editor 
						text={text}
						options={options}
						onChange={this.changeHanlder}
					/>
				</Modal>
				<Post 
					source={source}
					onReturn={this.returnHandler}
				></Post>
			</div>
		)
	},
	setTitleHandler(title){
		this.setState({
			title
		})
	},
	changeHanlder(text){
		this.setState({
			text
		})
	},
	openPostHandler() {
		this.setState({
			writing: true
		})
	},
	postHandler() {
		var {text,title} = this.state
		ipcRenderer.send('post.save',{
			text,title
		})
	},
	closePostHandler() {
		this.setState({
			writing: false
		})
	},
	searchHandler(text) {
		this.setState({
			loading: true
		})
		ipcRenderer.send('posts.search',text)
	},
	removeHandler(data) {
		ipcRenderer.send('post.remove',data)
	},
	viewHandler(file) {
		console.log(file)
		ipcRenderer.send('post.get',file)
	},
	returnHandler() {
		this.setState({
			source: null
		})
	}

})

module.exports = Content