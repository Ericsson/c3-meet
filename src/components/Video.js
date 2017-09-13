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
import classNames from 'classnames'

import {HtmlSink} from '@cct/libcct'

import styles from './Video.css'

class Video extends Component {
  constructor(props) {
    super(props)
    this.video = null
    this.sink = new HtmlSink()
    this.handleRef = this.handleRef.bind(this)
    this.handleVideoUpdate = this.handleVideoUpdate.bind(this)
    if (props.source) {
      props.source.connect(this.sink)
    }
  }

  handleVideoUpdate() {
    let width = 0
    let height = 0
    let aspectRatio = 0

    if (this.video) {
      width = this.video.videoWidth
      height = this.video.videoHeight

      if (width) {
        aspectRatio = width / height
      }
    }

    this.props.onResize({width, height, aspectRatio})
  }

  shouldComponentUpdate(newProps) {
    return newProps.source !== this.props.source
  }

  componentWillReceiveProps(newProps) {
    if (newProps.source !== this.props.source) {
      if (newProps.source) {
        newProps.source.connect(this.sink)
      } else if (this.source) {
        this.props.source.disconnect(this.sink)
      }
    }
  }

  handleRef(ref) {
    if (this.props.onResize && this.video) {
      this.video.removeEventListener('loadedmetadata', this.handleVideoUpdate)
      this.video.removeEventListener('emptied', this.handleVideoUpdate)
    }
    this.sink.target = ref
    this.video = ref
    if (this.props.onResize) {
      if (ref) {
        ref.addEventListener('loadedmetadata', this.handleVideoUpdate)
        ref.addEventListener('emptied', this.handleVideoUpdate)
      }
      this.handleVideoUpdate()
    }
  }

  render() {
    let {className, muted} = this.props
    return (
      <video className={classNames(styles.video, className)} ref={this.handleRef} muted={muted} autoPlay/>
    )
  }
}

Video.propTypes = {
  className: PropTypes.string,
  muted: PropTypes.bool,
  source: PropTypes.object,
  onResize: PropTypes.func,
}

export default Video
