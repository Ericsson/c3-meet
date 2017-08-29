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

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import Jumbotron from 'components/Jumbotron'
import RoomInput from 'components/RoomInput'

class SetupPage extends Component {
  joinRoom(room) {
    this.props.history.push(`/${room}`)
  }
  render() {
    return (
      <div>
        <Jumbotron
          header='C3 Meet'
          subheader='Conferencing made simple'
        >
          <RoomInput onSubmit={room => this.joinRoom(room)}/>
        </Jumbotron>
      </div>
    )
  }
}

SetupPage.propTypes = {
  history: PropTypes.object.isRequired,
}

const mapStateToProps = state => {
  return state
}

export default connect(mapStateToProps)(withRouter(SetupPage))
