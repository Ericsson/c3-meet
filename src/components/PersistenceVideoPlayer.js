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
import {PersistenceSink} from '@cct/libcct'

import styles from './Video.css'

class PersistenceVideoPlayer extends Component {
  constructor(props) {
    super(props)
    this.handleRef = this.handleRef.bind(this)

    this.sink = new PersistenceSink()
    if (props.source) {
      props.source.connect(this.sink)
    }
  }

  shouldComponentUpdate(newProps) {
    return newProps.source !== this.props.source
  }

  componentWillUpdate(newProps) {
    if (newProps.source) {
      newProps.source.connect(this.sink)
    } else if (this.source) {
      this.props.source.disconnect(this.sink)
    }
  }

  componentWillUnmount() {
    this.sink.stop()
  }

  handleRef(ref) {
    this.sink.target = ref
  }

  render() {
    let {className} = this.props
    return (
      <canvas className={classNames(styles.video, className)} ref={this.handleRef}/>
    )
  }
}

PersistenceVideoPlayer.propTypes = {
  className: PropTypes.string,
  source: PropTypes.object,
}

export default PersistenceVideoPlayer
