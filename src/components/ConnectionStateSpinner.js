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

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import styles from './ConnectionStateSpinner.css'

const ConnectionStateSpinner = ({connectionState, className}) => {
  if (!connectionState || connectionState === 'signaling') {
    return (
      <div className={classNames(styles.spinner, className)}>
        <div className={classNames(styles.circle, styles.inner)}/>
        <div className={classNames(styles.circle, styles.outer)}/>
      </div>
    )
  } else if (connectionState === 'connecting' || connectionState === 'connected') {
    return (
      <div className={classNames(styles.spinner, className)}>
        <div className={classNames(styles.circle, styles.inner, styles.fast)}/>
        <div className={classNames(styles.circle, styles.outer, styles.fast)}/>
      </div>
    )
  } else if (connectionState === 'reconnecting' || connectionState === 'closed') {
    return (
      <div className={classNames(styles.spinner, className)}>
        <div className={classNames(styles.circle, styles.inner, styles.slow)}/>
        <div className={classNames(styles.circle, styles.outer, styles.slow)}/>
      </div>
    )
  }
}

ConnectionStateSpinner.propTypes = {
  className: PropTypes.string,
  connectionState: PropTypes.string,
}

export default ConnectionStateSpinner
