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

import styles from './LoadingPage.css'

const LoadingPage = ({size = 4, durationFactor = 450, delayFactor = 90, initialDelay = 500}) => {
  let animationDuration = `${size * durationFactor}ms`
  let indices = Array(size).fill().map((ignore, index) => index)
  let rows = indices.map(outerIndex => (
    <div key={outerIndex} className={styles.row}>
      {indices.map(innerIndex => {
        let style = {
          animationDuration,
          animationDelay: `${initialDelay + ((outerIndex + innerIndex) * delayFactor)}ms`,
        }
        return <div key={innerIndex} className={styles.cube} style={style}/>
      })}
    </div>
  ))
  return (
    <div className={styles.container}>
      {rows}
    </div>
  )
}

LoadingPage.propTypes = {
  delayFactor: PropTypes.number,
  durationFactor: PropTypes.number,
  initialDelay: PropTypes.number,
  size: PropTypes.number,
}

export default LoadingPage
