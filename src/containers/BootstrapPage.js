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

import styles from './BootstrapPage.css'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import Spinner from 'react-spinkit'

import ErrorMessage from 'components/ErrorMessage'
import WhiteBox from 'components/WhiteBox'

import DisplayNameInput from 'containers/DisplayNameInput'

import {authenticateClient, checkForStoredDisplayName} from 'actions/client'

class BootstrapPage extends Component {
  componentWillMount() {
    localStorage.clear()
    this.props.checkForStoredDisplayName()
    this.props.authenticateClient(this.props.client)
  }

  componentWillUnmount() {
  }

  render() {
    let {props} = this

    if (!props.hasStoredDisplayName) {
      return (
        <WhiteBox>
          <DisplayNameInput/>
        </WhiteBox>
      )
    }
    if (props.authenticateError) {
      return (
        <WhiteBox>
          <ErrorMessage error={props.authenticateError}/>
        </WhiteBox>
      )
    } else if (props.setDisplayNameError) {
      return (
        <WhiteBox>
          <ErrorMessage error={props.setDisplayNameError}/>
        </WhiteBox>
      )
    }
    if (props.authenticateInProgress || props.setDisplayNameInProgress) {
      return <Spinner name='cube-grid' fadeIn='half' className={styles.spinner}/>
    }
    return props.children
  }
}

BootstrapPage.propTypes = {
  authenticateClient: PropTypes.func.isRequired,
  client: PropTypes.object.isRequired,
  checkForStoredDisplayName: PropTypes.func.isRequired,
  hasStoredDisplayName: PropTypes.bool.isRequired,

  children: PropTypes.element,
  connectionState: PropTypes.string,
  displayName: PropTypes.string,
}

const mapStateToProps = state => ({
  client: state.client.client,
  connectionState: state.client.connectionState,
  displayName: state.client.displayName,
  hasStoredDisplayName: state.client.hasStoredDisplayName,
  authenticateInProgress: state.client.authenticateClientInProgress,
  authenticateError: state.client.authenticateClientError,
  // authenticateError: new Error('derp'),
  setDisplayNameInProgress: state.client.setDisplayNameInProgress,
  setDisplayNameError: state.client.setDisplayNameError,
})

const mapDispatchToProps = dispatch => ({
  authenticateClient: client => dispatch(authenticateClient(client)),
  checkForStoredDisplayName: client => dispatch(checkForStoredDisplayName(client)),
})

export default connect(mapStateToProps, mapDispatchToProps)(BootstrapPage)
