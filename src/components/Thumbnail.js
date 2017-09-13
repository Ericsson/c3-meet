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

import ConferencePeerConnectionState from 'components/ConferencePeerConnectionState'
import ElementHolder from 'components/ElementHolder'

import styles from './Thumbnail.css'

const Thumbnail = ({element, peer, userAgent}) => {
  var userAgentText = null
  if (userAgent) {
    let {browser, version, platform, device} = userAgent
    userAgentText = (
      <div className={styles.userAgent}>
        {`${browser} ${version}, ${device} ${platform}`}
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {peer && <ConferencePeerConnectionState peer={peer}/>}
      {element && <ElementHolder className={styles.holder} element={element}/>}
      {element && <div className={styles.userId}>{element.peerId}</div>}
      {userAgentText}
    </div>
  )
}

Thumbnail.propTypes = {
  element: PropTypes.object,
  peer: PropTypes.object,
  userAgent: PropTypes.object,
}

export default Thumbnail
