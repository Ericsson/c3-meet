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
import {HtmlSink} from '@cct/libcct'

class Audio extends Component {
  constructor() {
    super()
    this.handleRef = this.handleRef.bind(this)
  }

  shouldComponentUpdate(newProps) {
    return newProps.source !== this.props.source
  }

  componentWillUpdate(newProps) {
    if (newProps.source) {
      newProps.source.connect(this.sink)
    } else if (this.audio) {
      this.audio.src = ''
    }
  }

  handleRef(ref) {
    this.sink = new HtmlSink({target: ref})
    this.audio = ref
    if (this.props.source) {
      this.props.source.connect(this.sink)
    } else if (this.audio) {
      this.audio.src = ''
    }
  }

  render() {
    return (
      <audio className='Audio' ref={this.handleRef} muted={this.props.muted} autoPlay/>
    )
  }
}

Audio.propTypes = {
  source: PropTypes.object,
  muted: PropTypes.bool,
}

export default Audio
