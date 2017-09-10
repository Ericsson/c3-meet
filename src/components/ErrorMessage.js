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

import styles from './ErrorMessage.css'

const ErrorMessage = ({error, className, ...props}) => {
  if (!error) {
    return null
  }
  return (
    <span className={classNames(className, styles.message)}>
      <span className={`${styles.icon} fa-stack`}>
        <i className='fa fa-circle fa-stack-2x'/>
        <i className='fa fa-stack-1x fa-exclamation fa-inverse'/>
      </span>
      <span className={styles.text}>
        {error.displayMessage || error.message || ('' + error)}
      </span>
    </span>
  )
}

ErrorMessage.propTypes = {
  error: PropTypes.instanceOf(Error),
  className: PropTypes.string,
}

export default ErrorMessage
