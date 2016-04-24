var React = require('react')

var index = React.createClass({
	getDefaultProps: function() {
		return {
			show: false
		}
	},
	render: function() {
		var {show} = this.props
		return <div className="loading" style={{
			display: show ? 'block' : 'none'
		}}></div>
	}

})

module.exports = index