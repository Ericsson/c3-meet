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

import styles from './NotFoundPage.css'

const NotFoundPage = ({className}) => (
  <div className={classNames(styles.page, className)}>
    <span className={styles.text}>404 Not Found</span>
    <span className={styles.sadface}>:(</span>
  </div>
)

NotFoundPage.propTypes = {
  className: PropTypes.string,
}

export default NotFoundPage
