require('./list.scss')

var React = require('react'),
	Loading = require('../loading/index.jsx')

var List = React.createClass({
	getDefaultProps: function() {
		return {
			fetching: true	
		}
	},
	getInitialState: function() {
		return {
		}
	},
	componentDidMount: function() {
		
	},
	render: function() {
		var {fetching,data} = this.props
		var ret = []
		if(data && data.length){
			data.forEach(function(d,index){
				var img
				if(d.hasImage){
					img = (
						<div className="card-image">
				      <img src={d.hasImage} className="img-responsive" />
				    </div>
					)
				}
				ret.push(
					<div className="column col-4" key={index}>
						<div className="card">
					    {img}
					    <div className="card-header">
					        <h4 className="card-title">{d.title}</h4>
					        <h6 className="card-meta">{d.postDate}</h6>
					    </div>
					    <div className="card-body" dangerouslySetInnerHTML={{
					    	__html: d.shortContent
					    }}>
					    </div>
					    <div className="card-footer">
					        <button className="btn btn-primary" onClick={this.onView.bind(null,d.file)}>查看</button>
					        <button className="btn" onClick={this.onRemove.bind(null,d.file,index)}>删除</button>
					    </div>
						</div>
					</div>
				)
			},this)
		}else{
			ret = (
				<div className="toast">
				  暂无文章
				</div>
			)
		}
		
		return (
			<div className={data && data.length ? "list columns" : "list"}>
				<Loading show={fetching} />
				{ret}
			</div>
			
		)
	},
	onRemove(filename,index) {
		var {onRemove} = this.props
		onRemove && onRemove({
			filename,index
		})
	},
	onView(file) {
		var {onView} = this.props
		onView && onView(file)
	}

})

module.exports = List