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
import {DeviceSource} from '@cct/libcct'

import Video from 'components/Video'

import styles from './VideoDevicePreview.css'

class VideoDevicePreview extends Component {
  componentWillMount() {
    this.source = new DeviceSource({video: {
      device: {exact: this.props.device},
      aspectRatio: 16 / 9,
      width: 160,
      height: 90,
    }})
  }

  componentWillUnmount() {
    this.source.stop()
    this.source = null
  }

  render() {
    return <Video className={styles.video} source={this.source}/>
  }
}

VideoDevicePreview.propTypes = {
  device: PropTypes.object,
}

export default VideoDevicePreview
