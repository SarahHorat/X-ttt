import React, {Component} from 'react'

export default class SetGameType extends Component {

	constructor (props) {
		super(props)

		this.state = {}
	}

//	------------------------	------------------------	------------------------

	render () {
		return (
			<div id='SetGameType'>

				<h1>Choose game type</h1>

				<button type='submit' onClick={this.selTypeLive.bind(this)} className='button long'><span>Live against another player <span className='fa fa-caret-right'></span></span></button>

				&nbsp;&nbsp;&nbsp;&nbsp;

				<button type='submit' onClick={this.selTypeCompEasy.bind(this)} className='button long'><span>Against an easy computer <span className='fa fa-caret-right'></span></span></button>
				<button type='submit' onClick={this.selTypeCompMedium.bind(this)} className='button long'><span>Against a medium computer <span className='fa fa-caret-right'></span></span></button>
				<button type='submit' onClick={this.selTypeCompHard.bind(this)} className='button long'><span>Against a hard computer <span className='fa fa-caret-right'></span></span></button>

			</div>
		)
	}

//	------------------------	------------------------	------------------------

	selTypeLive (e) {
		// const { name } = this.refs
		// const { onSetType } = this.props
		// onSetType(name.value.trim())

		this.props.onSetType('live')
	}

//	------------------------	------------------------	------------------------

	selTypeCompEasy (e) {
		// const { name } = this.refs
		// const { onSetType } = this.props
		// onSetType(name.value.trim())

		this.props.compDifficulty('easy')
		this.props.onSetType('comp')
	}

	selTypeCompMedium (e) {
		// const { name } = this.refs
		// const { onSetType } = this.props
		// onSetType(name.value.trim())

		this.props.compDifficulty('medium')
		this.props.onSetType('comp')
	}

	selTypeCompHard (e) {
		// const { name } = this.refs
		// const { onSetType } = this.props
		// onSetType(name.value.trim())

		this.props.compDifficulty('hard')
		this.props.onSetType('comp')
	}

}
