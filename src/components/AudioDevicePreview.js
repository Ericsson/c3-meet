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
import {DeviceSource, WaveformView, browserInfo} from '@cct/libcct'

import styles from './AudioDevicePreview.css'

class AudioDevicePreview extends Component {
  constructor(props) {
    super(props)
    this.handleCanvasRef = this.handleCanvasRef.bind(this)

    this.waveformView = new WaveformView()
  }

  componentWillMount(props = this.props) {
    if (browserInfo.browser === 'firefox') {
      if (props.checked) {
        this.startPreview(props.device)
      }
    } else {
      this.startPreview(props.device)
    }
  }

  componentWillReceiveProps(newProps) {
    if (browserInfo.browser === 'firefox' && this.props.checked !== newProps.checked) {
      this.stopPreview()
      this.componentWillMount(newProps)
    }
  }

  componentWillUnmount() {
    this.stopPreview()
  }

  startPreview(device) {
    this.source = new DeviceSource({audio: {device}})
    this.source.connect(this.waveformView)
    this.source.promise.catch(console.error)
  }

  stopPreview() {
    if (this.source) {
      this.source.disconnect(this.waveformView)
      this.source.stop()
      this.source = null
      if (this.canvas) {
        let context = this.canvas.getContext('2d')
        let {width, height} = this.canvas
        context.clearRect(0, 0, width, height)
      }
    }
  }

  handleCanvasRef(canvas) {
    this.canvas = canvas
    if (canvas) {
      canvas.width = 160
      canvas.height = 45
      let context = canvas.getContext('2d')
      context.lineWidth = 0.5
    }
    this.waveformView.canvas = canvas
  }

  render() {
    return <canvas className={styles.waveform} ref={this.handleCanvasRef}/>
  }
}

AudioDevicePreview.propTypes = {
  checked: PropTypes.bool,
  device: PropTypes.object,
}

export default AudioDevicePreview
