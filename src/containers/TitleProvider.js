/*
Copyright 2017 Ericsson AB.

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

import {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import {title} from 'modules/config'

class ClientProvider extends Component {
  componentWillMount() {
    this.updateTitle(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.updateTitle(nextProps)
  }

  updateTitle({roomName = null}) {
    if (roomName) {
      document.title = `${title} - ${roomName}`
    } else {
      document.title = title
    }
  }

  render() {
    return this.props.children
  }
}

ClientProvider.propTypes = {
  children: PropTypes.element.isRequired,
  roomName: PropTypes.string,
}

const mapStateToProps = ({meeting}) => ({
  roomName: meeting.room && meeting.room.name,
})

export default connect(mapStateToProps)(ClientProvider)

