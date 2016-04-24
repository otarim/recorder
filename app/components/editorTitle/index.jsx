var React = require('react')

var EditorTitle = React.createClass({

	render: function() {
		return (
			<div className="form-group">
				<input type="text" className="form-input" onChange={this.onChange} placeholder="标题"/>
			</div>
		)
	},
	onChange(e) {
		var {onChange} = this.props
		onChange && onChange(e.target.value)
	}

})

module.exports = EditorTitle