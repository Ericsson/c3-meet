
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import {setClient, updateOwnUser, updateClientConnectionState} from 'actions'

class ClientProvider extends Component {
  static childContextTypes = {
    client: PropTypes.object,
  }

  constructor(props) {
    super(props)
    this._onStateChange = this._onStateChange.bind(this)
  }

  componentWillMount() {
    this.props.setClient(this.props.client)
    this.props.onOwnUser(this.props.client.user)
    this.props.onConnectionState(this.props.client.state)
  }


  componentWillUnmount() {
    this.props.client.off('state')
    this.props.setClient(null)
    this.props.onOwnUser(null)
    this.props.onConnectionState(null)
  }

  _onStateChange(connectionState) {
    if (connectionState === 'connected') {
      this.props.onOwnUser(this.props.client.user)
    } else {
      this.props.onOwnUser(null)
    }
    this.props.onConnectionState(connectionState)
  }

  getChildContext() {
    return {client: this.props.client}
  }

  render() {
    return this.props.children
  }
}

ClientProvider.propTypes = {
  client: PropTypes.object,
  children: PropTypes.element.isRequired,
}

const mapDispatchToProps = dispatch => ({
  setClient: client => dispatch(setClient(client)),
  onOwnUser: user => dispatch(updateOwnUser(user)),
  onConnectionState: connectionState => dispatch(updateClientConnectionState(connectionState)),
})

export default connect(null, mapDispatchToProps)(ClientProvider)

