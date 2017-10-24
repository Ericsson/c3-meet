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
import {browserInfo} from '@cct/libcct'

import {requestMediaPermissions} from 'actions/mediaSettings'

import Button from 'components/Button'
import ErrorMessage from 'components/ErrorMessage'
import RadioButton from 'components/RadioButton'
import Video from 'components/Video'
import WhiteBox from 'components/WhiteBox'

import styles from './DevicePermissionPage.css'

class DevicePermissionPage extends Component {
  constructor(props) {
    super(props)
    this.handleAccessClick = this.handleAccessClick.bind(this)
  }

  handleAccessClick() {
    this.props.requestMediaPermissions()
  }

  render() {
    let {error, havePermissions} = this.props
    if (havePermissions) {
      return null
    }

    return (
      <WhiteBox>
        <div className={styles.box}>
          <div className={styles.header}>Meeting preparation</div>
          <div className={styles.message}>
            You are about to enter a video meeting and need to allow access your media devices.
          </div>
          {browserInfo.browser === 'firefox' && <div className={styles.detail}>
            Please select "Remember this decision", as it is needed to list available
            devices, and to avoid additional dialogs.
          </div>}
          <Button className={styles.button} onClick={this.handleAccessClick}>Allow media device access</Button>
          {error && <ErrorMessage error={error.message} className={styles.error}/>}
        </div>
      </WhiteBox>
    )
  }
}

DevicePermissionPage.propTypes = {
}

const mapStateToProps = ({mediaSettings}) => ({
  error: mediaSettings.permissionError,
  havePermissions: mediaSettings.havePermissions,
})

const mapDispatchToProps = dispatch => ({
  requestMediaPermissions: () => dispatch(requestMediaPermissions()),
})

export default connect(mapStateToProps, mapDispatchToProps)(DevicePermissionPage)
