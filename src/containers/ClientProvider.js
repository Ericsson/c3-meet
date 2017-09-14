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

import {updateClient} from 'actions/client'

class ClientProvider extends Component {
  constructor(props) {
    super(props)
    this.handleStateChange = this.handleStateChange.bind(this)
    this.handleNameChange = this.handleNameChange.bind(this)
  }

  getChildContext() {
    return {client: this.props.client}
  }

  componentWillMount() {
    this.props.client.on('state', this.handleStateChange)
    this.handleStateChange(this.props.client.state)
  }

  componentWillUnmount() {
    this.props.client.off('state', this.handleStateChange)
    this.props.client.logout()
    this.props.updateClient(null)
  }

  handleStateChange() {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
    if (this.props.client.connectionState === 'connected') {
      let {user} = this.props.client
      user.on('name', this.handleNameChange)
      this.unsubscribe = () => {
        user.off('name', this.handleNameChange)
      }
    }
    this.props.updateClient(this.props.client)
  }

  handleNameChange() {
    this.props.updateClient(this.props.client)
  }

  render() {
    return this.props.children
  }
}

ClientProvider.childContextTypes = {
  client: PropTypes.object,
}

ClientProvider.propTypes = {
  children: PropTypes.element.isRequired,
  client: PropTypes.object.isRequired,
  updateClient: PropTypes.func.isRequired,
}

const mapDispatchToProps = dispatch => ({
  updateClient: user => dispatch(updateClient(user)),
})

export default connect(null, mapDispatchToProps)(ClientProvider)

