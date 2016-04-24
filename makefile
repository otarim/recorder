dev:
	webpack --config webpack.config.dev.js -d --progress --colors --watch

release:
	electron-packager ./ --platform=darwin --arch=x64 --overwrite --ignore="node_modules/babel-*"\
		--ignore="node_modules/webpack"\
		--ignore="node_modules/*-loader"\
		--ignore="node_modules/electron-*"\
		--ignore="node_modules/extract-text-webpack-plugin"\
		--ignore="node_modules/html-webpack-plugin"\
		--ignore="node_modules/isomorphic-fetch"\
		--ignore="node_modules/node-*"\
		--icon="./app.icns"

run:
	npm install && webpack --config webpack.config.dev.js