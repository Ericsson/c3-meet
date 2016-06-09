import React, {PropTypes, Component} from 'react'

class RoomInput extends Component {
  constructor (props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    this.state = {
      inputText: '',
    }
  }

  handleChange (event) {
    this.setState({
      inputText: event.target.value,
    })
  }

  handleSubmit (event) {
    event.preventDefault()
    let input = this.state.inputText
    if (input.length > 0) {
      this.props.onSubmit(input)
    }
    return false
  }

  render () {
    const {inputText} = this.state
    return (
      <form className="roomInput" onSubmit={this.handleSubmit}>
        <input
          type="text"
          value={inputText}
          onChange={this.handleChange}
          name="room"
          autoFocus="true"
          placeholder="EnterRoomName123"
          maxLength="30"
          size="30"
          title="At least 5 letters and numbers, a-z A-Z 0-9"
          pattern="[a-zA-Z0-9]{5,30}" />
      </form>
    )
  }
}

RoomInput.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}

export default RoomInput
