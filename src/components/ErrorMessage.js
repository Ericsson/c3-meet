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
import {AlertOctagon} from 'react-feather'

import styles from './ErrorMessage.css'

const ErrorMessage = ({error, className}) => {
  if (!error) {
    return null
  }
  return (
    <span className={classNames(className, styles.message)}>
      <AlertOctagon className={styles.icon}/>
      <span className={styles.text}>
        {error.displayMessage || error.message || ('' + error)}
      </span>
    </span>
  )
}

ErrorMessage.propTypes = {
  className: PropTypes.string,
  error: PropTypes.instanceOf(Error),
}

export default ErrorMessage
