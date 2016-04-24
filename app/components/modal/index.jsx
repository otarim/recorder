var React = require('react')
var Modal = React.createClass({

	render: function() {
		var {title,show} = this.props
		return (
			<div className={show ? 'modal active' : 'modal'}>
			    <div className="modal-overlay"></div>
			    <div className="modal-container">
			        <div className="modal-header">
			            <div className="modal-title">{title}</div>
			        </div>
			        <div className="modal-body">
			            <div className="content">
			            	{this.props.children}
			            </div>
			        </div>
			        <div className="modal-footer">
			            <button className="btn btn-link" onClick={this.onCancle}>关闭</button>
			            <button className="btn btn-primary" onClick={this.onConfirm}>确认</button>
			        </div>
			    </div>
			</div>
		)
	},
	onCancle() {
		this.props.onClose && this.props.onClose()
	},
	onConfirm() {
		this.props.onConfirm && this.props.onConfirm()
	}

})

module.exports = Modal