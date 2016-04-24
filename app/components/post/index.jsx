var React = require('react')

require('./post.scss')

var index = React.createClass({

	render: function() {
		var {source} = this.props
		if(source){
			return (
				<div className={source ? "post active" : "post"}>
					<h1>{source.title}</h1>
					<aside>
						{source.postDate}
					</aside>
					<article dangerouslySetInnerHTML={{
			    	__html: source.content
			    }}>
					</article>
					<footer>
						<button className="btn btn-lg" onClick={this.onReturn}>返回</button>
					</footer>
				</div>
			)
		}else{
			return null
		}
	},
	onReturn() {
		var {onReturn} = this.props
		onReturn && onReturn()
	}

})

module.exports = index