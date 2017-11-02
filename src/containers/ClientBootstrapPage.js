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

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import ErrorMessage from 'components/ErrorMessage'
import LoadingPage from 'components/LoadingPage'
import WhiteBox from 'components/WhiteBox'

import DisplayNameInput from 'containers/DisplayNameInput'
import DeviceSelectionPage from 'containers/DeviceSelectionPage'
import DevicePermissionPage from 'containers/DevicePermissionPage'

import {loadMeetingList} from 'actions/meetingHistory'
import {authenticateClient} from 'actions/client'
import {checkMediaPermissions} from 'actions/mediaSettings'

import styles from './ClientBootstrapPage.css'

class ClientBootstrapPage extends Component {
  componentWillMount() {
    this.props.loadMeetingList()
    this.props.authenticateClient(this.props.client)
    this.props.checkMediaPermissions()
  }

  render() {
    let {props} = this

    if (!props.storedDisplayName) {
      return (
        <WhiteBox>
          <DisplayNameInput/>
        </WhiteBox>
      )
    }

    if (!props.havePermissions) {
      return <DevicePermissionPage/>
    }

    if (!props.haveSelectedMediaDevices) {
      return <DeviceSelectionPage/>
    }

    if (props.authenticateError) {
      return (
        <WhiteBox>
          <ErrorMessage error={props.authenticateError} className={styles.error}/>
        </WhiteBox>
      )
    } else if (props.setDisplayNameError) {
      return (
        <WhiteBox>
          <ErrorMessage error={props.setDisplayNameError} className={styles.error}/>
        </WhiteBox>
      )
    }
    if (props.authenticateInProgress || props.setDisplayNameInProgress) {
      return <LoadingPage/>
    }
    return props.children
  }
}

ClientBootstrapPage.propTypes = {
  authenticateClient: PropTypes.func.isRequired,
  checkMediaPermissions: PropTypes.func.isRequired,
  client: PropTypes.object.isRequired,
  havePermissions: PropTypes.bool.isRequired,
  haveSelectedMediaDevices: PropTypes.bool.isRequired,
  loadMeetingList: PropTypes.func.isRequired,
  storedDisplayName: PropTypes.string.isRequired,

  children: PropTypes.element,
  connectionState: PropTypes.string,
  displayName: PropTypes.string,
}

const mapStateToProps = state => ({
  client: state.client.client,
  connectionState: state.client.connectionState,
  havePermissions: state.mediaSettings.havePermissions,
  haveSelectedMediaDevices: state.mediaSettings.haveSelectedMediaDevices,
  displayName: state.client.displayName,
  storedDisplayName: state.client.storedDisplayName,
  authenticateInProgress: state.client.authenticateInProgress,
  authenticateError: state.client.authenticateClientError,
  setDisplayNameInProgress: state.client.setDisplayNameInProgress,
  setDisplayNameError: state.client.setDisplayNameError,
})

const mapDispatchToProps = dispatch => ({
  authenticateClient: client => dispatch(authenticateClient(client)),
  loadMeetingList: options => dispatch(loadMeetingList(options)),
  checkMediaPermissions: options => dispatch(checkMediaPermissions()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ClientBootstrapPage)
