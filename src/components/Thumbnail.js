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
import {MicOff} from 'react-feather'

import ConnectionStateSpinner from 'components/ConnectionStateSpinner'
import ElementHolder from 'components/ElementHolder'

import styles from './Thumbnail.css'

const Thumbnail = ({className, peerId, hasMutedSelf, userAgent, connectionState, element}) => {
  let userAgentDescription = ''
  if (userAgent) {
    let {browser, version, platform, device} = userAgent
    userAgentDescription = `${browser} ${version}, ${device} ${platform}`
  }
  return (
    <div className={classNames(styles.container, className)}>
      <div className={styles.sizer}>
        <div className={styles.thumbnail}>
          <ConnectionStateSpinner connectionState={connectionState} className={styles.spinner}/>
          <span className={styles.peerId}>{peerId}</span>
          <ElementHolder element={element} className={styles.elementHolder}/>
          {hasMutedSelf && <MicOff className={styles.selfMuteIndicator}/>}
          <div className={styles.overlay}>
            <span className={styles.peerId}>{peerId}</span>
            <span className={styles.userAgent}>{userAgentDescription}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

Thumbnail.propTypes = {
  hasMutedSelf: PropTypes.bool.isRequired,
  muted: PropTypes.bool.isRequired,
  peerId: PropTypes.string.isRequired,
  userAgent: PropTypes.object,
  className: PropTypes.string,
  connectionState: PropTypes.string,
  element: PropTypes.instanceOf(HTMLElement),
  errorState: PropTypes.instanceOf(Error),
}

export default Thumbnail
