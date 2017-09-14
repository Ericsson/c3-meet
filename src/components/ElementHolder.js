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

import {log} from '@cct/libcct'

class ElementHolder extends Component {
  constructor(props) {
    super(props)
    this._onContainerRef = this._onContainerRef.bind(this)
  }

  shouldComponentUpdate(nextProps) {
    return this.props.element !== nextProps.element
  }

  componentWillUpdate(nextProps) {
    if (!this._ref) {
      return
    }

    if (this._ref.hasChildNodes()) {
      this._ref.innerHTML = ''
    }
    let nextElement = nextProps.element
    if (nextElement) {
      this._ref.appendChild(nextElement)
      if (nextElement.play) {
        nextElement.play()
          .catch(error => log('meet', `thumbnail play error, ${error}`))
      }
    }
  }

  _onContainerRef(ref) {
    this._ref = ref
    let {element} = this.props
    if (element && ref) {
      ref.appendChild(element)
      if (element.play) {
        element.play()
          .catch(error => log('meet', `thumbnail play error, ${error}`))
      }
    }
  }

  render() {
    let {element, ...props} = this.props
    if (element) {
      return <div {...props} ref={this._onContainerRef}/>
    } else {
      return null
    }
  }
}

ElementHolder.propTypes = {
  element: PropTypes.instanceOf(HTMLElement),
}

export default ElementHolder
