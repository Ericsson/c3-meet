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

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import styles from './WhiteBox.css'

const WhiteBox = ({children, className, ...props}) => {
  return (
    <div className={classNames(className, styles.box)} {...props}>
      {children}
    </div>
  )
}

WhiteBox.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
  className: PropTypes.string,
}

const Divider = ({children, className, ...props}) => {
  return (
    <div className={classNames(className, styles.divider)} {...props}/>
  )
}

Divider.propTypes = {
  className: PropTypes.string,
}

WhiteBox.Divider = Divider

export default WhiteBox
