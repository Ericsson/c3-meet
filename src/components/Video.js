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

import {HtmlSink} from '@cct/libcct';

class Video extends Component {
  constructor(props) {
    super(props)
    this._videoElement = null
    this._sink = new HtmlSink()
    this._handleRef = this._handleRef.bind(this)
    this._handleVideoUpdate = this._handleVideoUpdate.bind(this)
    if (props.source) {
      props.source.connect(this._sink)
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.source !== this.props.source) {
      if (newProps.source) {
        newProps.source.connect(this._sink)
      } else if (this.source) {
        this.props.source.disconnect(this._sink)
      }
    }
  }

  _handleRef(ref) {
    if (this.props.onResize && this._videoElement) {
      this._videoElement.removeEventListener('loadedmetadata', this._handleVideoUpdate)
      this._videoElement.removeEventListener('emptied', this._handleVideoUpdate)
    }
    this._sink.target = ref
    this._videoElement = ref
    if (this.props.onResize) {
      if (ref) {
        ref.addEventListener('loadedmetadata', this._handleVideoUpdate)
        ref.addEventListener('emptied', this._handleVideoUpdate)
      }
      this._handleVideoUpdate()
    }
  }

  _handleVideoUpdate() {
    let width = 0
    let height = 0
    let aspectRatio = 0

    if (this._videoElement) {
      width = this._videoElement.videoWidth
      height = this._videoElement.videoHeight

      if (height) {
        aspectRatio = width / height
      }
    }

    this.props.onResize({width, height, aspectRatio})
  }

  render() {
    let props = Object.assign({}, this.props)
    let className = `${props.className || ''} Video`
    delete props.source
    delete props.onResize
    return (
      <video {...props} className={className} ref={this._handleRef} autoPlay/>
    )
  }
}

Video.propTypes = {
  className: PropTypes.string,
  source: PropTypes.object,
  onResize: PropTypes.func,
  muted: PropTypes.bool,
}

export default Video
