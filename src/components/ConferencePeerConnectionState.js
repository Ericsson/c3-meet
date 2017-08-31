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

import styles from './ConferencePeerConnectionState.css'
import React, {Component} from 'react'
import PropTypes from 'prop-types'

class ConferencePeerConnectionState extends Component {
  constructor(props) {
    super(props)
    this._onChange = this._onChange.bind(this)
    this.state = {
      connectionState: this.props.peer.connectionState,
    }
  }
  componentWillMount() {
    this.props.peer.on('connectionState', this._onChange)
  }
  componentWillUnmount() {
    this.props.peer.off('connectionState', this._onChange)
  }
  _onChange(connectionState) {
    this.setState({connectionState})
  }
  render() {
    return <span className={styles.main}>{this.state.connectionState}</span>
  }
}

ConferencePeerConnectionState.propTypes = {
  peer: PropTypes.object.isRequired,
}

export default ConferencePeerConnectionState
