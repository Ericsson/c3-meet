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

import {log} from '@cct/libcct'

class ElementHolder extends Component {
  constructor(props) {
    super(props)
    this._onContainerRef = this._onContainerRef.bind(this)
  }
  componentDidMount() {
    this._ref.appendChild(this.props.element)
    if (this.props.element.play) {
      this.props.element.play()
        .catch(error => log('meet', `thumbnail play error, ${error}`))
    }
  }
  componentWillReceiveProps(nextProps) {
    this._ref.removeChild(this.props.element)
    this._ref.appendChild(nextProps.element)
    if (nextProps.element.play) {
      nextProps.element.play()
        .catch(error => log('meet', `thumbnail play error, ${error}`))
    }
  }
  shouldComponentUpdate(nextProps) {
    return this.props.element !== nextProps.element
  }
  componentWillUnmount() {
    if (this._ref.children.length) {
      this._ref.removeChild(this.props.element)
    }
  }
  _onContainerRef(ref) {
    this._ref = ref
  }
  render() {
    let props = Object.assign({}, this.props)
    delete props.element
    return <div {...props} ref={this._onContainerRef}/>
  }
}

ElementHolder.propTypes = {
  element: PropTypes.instanceOf(HTMLElement).isRequired,
}

export default ElementHolder
