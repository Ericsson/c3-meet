
import {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import {setClient, updateOwnUser, updateDisplayName, updateClientConnectionState} from 'actions/client'

class ClientProvider extends Component {
  constructor(props) {
    super(props)
    this._onStateChange = this._onStateChange.bind(this)
  }

  getChildContext() {
    return {client: this.props.client}
  }

  componentWillMount() {
    this.props.setClient(this.props.client)
    this.props.updateOwnUser(this.props.client.user)
    this.props.updateConnectionState(this.props.client.state)
    this.props.client.on('state', this.props.updateConnectionState)
  }

  componentWillUnmount() {
    this.props.client.off('state', this.props.updateConnectionState)
    this.props.setClient(null)
    this.props.updateOwnUser(null)
    this.props.updateConnectionState(null)
  }

  _onStateChange(connectionState) {
    if (connectionState === 'connected') {
      let {user} = this.props.client
      this.props.updateOwnUser(user)
      user.on('name', this.props.updateDisplayName)
      this.props.updateDisplayName(user.name)
    } else {
      this.props.updateDisplayName(null)
      this.props.updateOwnUser(null)
    }
    this.props.updateConnectionState(connectionState)
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
  setClient: PropTypes.func.isRequired,
  updateConnectionState: PropTypes.func.isRequired,
  updateDisplayName: PropTypes.func.isRequired,
  updateOwnUser: PropTypes.func.isRequired,
}

const mapDispatchToProps = dispatch => ({
  setClient: client => dispatch(setClient(client)),
  updateOwnUser: user => dispatch(updateOwnUser(user)),
  updateDisplayName: ownUserName => dispatch(updateDisplayName(ownUserName)),
  updateConnectionState: connectionState => dispatch(updateClientConnectionState(connectionState)),
})

export default connect(null, mapDispatchToProps)(ClientProvider)

