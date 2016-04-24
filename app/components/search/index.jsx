var React = require('react')

require('./search.scss')

var Search = React.createClass({
	getInitialState: function() {
		return {
			query: ''
		};
	},
	render: function() {
		return (
			<div className="input-group search">
		    <input type="text" className="form-input" placeholder="搜索标题，内容" onChange={this.onChange}/>
		    <button className="btn btn-primary input-group-btn" onClick={this.onSearch}>搜索</button>
			</div>
		)
	},
	onChange(e){
		this.setState({
			query: e.target.value
		})
	},
	onSearch() {
		var {onSearch} = this.props,
			{query} = this.state
		onSearch && onSearch(query)
	}

})

module.exports = Search