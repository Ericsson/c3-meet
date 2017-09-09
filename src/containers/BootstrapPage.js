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

import ErrorMessage from 'components/ErrorMessage'
import LoadingPage from 'components/LoadingPage'
import WhiteBox from 'components/WhiteBox'

import DisplayNameInput from 'containers/DisplayNameInput'

import {authenticateClient} from 'actions/client'

class BootstrapPage extends Component {
  componentWillMount() {
    this.props.authenticateClient(this.props.client)
  }

  componentWillUnmount() {
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
      return <LoadingPage/>
    }
    return props.children
  }
}

BootstrapPage.propTypes = {
  authenticateClient: PropTypes.func.isRequired,
  client: PropTypes.object.isRequired,
  storedDisplayName: PropTypes.string.isRequired,

  children: PropTypes.element,
  connectionState: PropTypes.string,
  displayName: PropTypes.string,
}

const mapStateToProps = state => ({
  client: state.client.client,
  connectionState: state.client.connectionState,
  displayName: state.client.displayName,
  storedDisplayName: state.client.storedDisplayName,
  authenticateInProgress: state.client.authenticateInProgress,
  authenticateError: state.client.authenticateClientError,
  // authenticateError: new Error('derp'),
  setDisplayNameInProgress: state.client.setDisplayNameInProgress,
  setDisplayNameError: state.client.setDisplayNameError,
})

const mapDispatchToProps = dispatch => ({
  authenticateClient: client => dispatch(authenticateClient(client)),
})

export default connect(mapStateToProps, mapDispatchToProps)(BootstrapPage)
