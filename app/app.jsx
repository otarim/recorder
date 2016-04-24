var react = require('react'),
	reactDom = require('react-dom'),
	Content = require('./components/content/index.jsx')
	
require('spectre.css/dist/spectre.css')
require('./app.scss')

reactDom.render(<Content/>,document.getElementById('app'))