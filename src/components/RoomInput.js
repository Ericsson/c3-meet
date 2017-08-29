/*
Copyright 2016 Ericsson AB.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React, {PropTypes, Component} from 'react'
import namegen from 'modules/namegen'

class RoomInput extends Component {
  constructor (props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    this.state = {
      inputText: namegen(),
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
