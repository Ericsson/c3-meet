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

import React, {Component, PropTypes} from 'react'
import {media} from '@cct/libcct'

const {HtmlSink} = media

class Video extends Component {
  constructor() {
    super()
    this.handleRef = this.handleRef.bind(this)
    this.handleVideoUpdate = this.handleVideoUpdate.bind(this)
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

  componentWillUpdate(newProps) {
    if (newProps.source) {
      newProps.source.connect(this.sink)
    } else if (this.video) {
      // TODO add support for this in libcct
      this.video.src = ''
    }
  }

  handleRef(ref) {
    this.sink = new HtmlSink({target: ref})
    this.video = ref
    if (this.props.source) {
      this.props.source.connect(this.sink)
    } else if (this.video) {
      this.video.src = ''
    }
    if (this.props.onResize) {
      if (ref) {
        ref.addEventListener('loadedmetadata', this.handleVideoUpdate)
        ref.addEventListener('emptied', this.handleVideoUpdate)
      }
      this.handleVideoUpdate()
    }
  }

  render() {
    return (
      <video className='Video' ref={this.handleRef} muted={this.props.muted} autoPlay />
    )
  }
}

Video.propTypes = {
  source: PropTypes.object,
  onResize: PropTypes.func,
  muted: PropTypes.bool,
}

export default Video
