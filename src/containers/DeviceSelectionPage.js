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

import AudioDevicePreview from 'components/AudioDevicePreview'
import VideoDevicePreview from 'components/VideoDevicePreview'
import Button from 'components/Button'
import RadioButton from 'components/RadioButton'
import WhiteBox from 'components/WhiteBox'

import {
  confirmMediaDeviceSelection,
  enumerateDevices,
  selectMediaDevices,
} from 'actions/mediaSettings'

import styles from './DeviceSelectionPage.css'

const DeviceListItem = ({label, checked, onChange, children}) => (
  <label className={styles.device}>
    <RadioButton
      className={styles.radio}
      checked={checked}
      onChange={onChange}
    />
    <span className={styles.label}>{label}</span>
    {children}
  </label>
)

DeviceListItem.propTypes = {
  checked: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
  label: PropTypes.string,
  onChange: PropTypes.func,
}

class DeviceSelectionPage extends Component {
  componentWillMount() {
    this.props.enumerateDevices()
  }

  render() {
    let {
      haveEnumeratedDevices,
      audioInputDevices,
      videoInputDevices,
      selectedAudioDevice,
      selectedVideoDevice,
    } = this.props

    if (!haveEnumeratedDevices) {
      return null
    }
    return (
      <WhiteBox>
        <div className={styles.form}>
          <span className={styles.header}>Select microphone</span>
          <div className={styles.devices}>
            {audioInputDevices.map(device => (
              <DeviceListItem
                key={device ? device.deviceId : 0}
                onChange={() => this.props.selectMediaDevices({audio: device})}
                checked={device === selectedAudioDevice}
                label={device.label}
              >
                <AudioDevicePreview device={device} checked={device === selectedAudioDevice}/>
              </DeviceListItem>

            ))}
          </div>
          <span className={styles.header}>Select webcam</span>
          <div className={styles.devices}>
            {videoInputDevices.map(device => (
              <DeviceListItem
                key={device ? device.deviceId : 0}
                onChange={() => this.props.selectMediaDevices({video: device})}
                checked={device === selectedVideoDevice}
                label={device.label}
              >
                <VideoDevicePreview device={device}/>
              </DeviceListItem>
            ))}
          </div>
          <Button className={styles.continue} onClick={this.props.handleDeviceSelected}>
            Continue
          </Button>
        </div>
      </WhiteBox>
    )
  }
}

DeviceSelectionPage.propTypes = {
  audioInputDevices: PropTypes.array.isRequired,
  enumerateDevices: PropTypes.func.isRequired,
  handleDeviceSelected: PropTypes.func.isRequired,
  haveEnumeratedDevices: PropTypes.bool.isRequired,
  selectMediaDevices: PropTypes.func.isRequired,
  videoInputDevices: PropTypes.array.isRequired,
  selectedAudioDevice: PropTypes.object,
  selectedVideoDevice: PropTypes.object,
}

const mapStateToProps = state => ({
  audioInputDevices: state.mediaSettings.audioInputDevices,
  haveEnumeratedDevices: state.mediaSettings.haveEnumeratedDevices,
  selectedAudioDevice: state.mediaSettings.selectedAudioDevice,
  selectedVideoDevice: state.mediaSettings.selectedVideoDevice,
  videoInputDevices: state.mediaSettings.videoInputDevices,
})

const mapDispatchToProps = dispatch => ({
  handleDeviceSelected: () => dispatch(confirmMediaDeviceSelection()),
  enumerateDevices: () => dispatch(enumerateDevices()),
  selectMediaDevices: devices => dispatch(selectMediaDevices(devices)),
})

export default connect(mapStateToProps, mapDispatchToProps)(DeviceSelectionPage)
