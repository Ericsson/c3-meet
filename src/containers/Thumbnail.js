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
import classNames from 'classnames'
import {connect} from 'react-redux'

import {togglePeerMute} from 'actions/meetingMedia'

import ElementHolder from 'components/ElementHolder'

import styles from './Thumbnail.css'

class Thumbnail extends Component {
  render() {
    let {className, peerId, element} = this.props
    return (
      <div className={classNames(styles.container, className)}>
        <div className={styles.sizer}>
          <div className={styles.thumbnail}>
            <ElementHolder element={element} className={styles.elementHolder}/>
            {peerId}
          </div>
        </div>
      </div>
    )
  }
}

Thumbnail.propTypes = {
  peerId: PropTypes.string.isRequired,
  muted: PropTypes.bool.isRequired,
  element: PropTypes.instanceOf(HTMLElement),
  connectionState: PropTypes.string,
  errorState: PropTypes.instanceOf(Error),
}

const mapStateToProps = ({meetingMedia, meetingPeers}, {peerId}) => {
  let peer = meetingPeers.peers[peerId] || null
  return {
    muted: !!meetingMedia.mutedPeers[peerId],
    element: meetingMedia.thumbnailElements[peerId] || null,
    connectionState: peer ? peer.connectionState : null,
    errorState: peer ? peer.errorState : null,
  }
}

const mapDispatchToProps = (dispatch, {peerId}) => ({
  toggleMute: () => dispatch(togglePeerMute({peerId})),
})

export default connect(mapStateToProps, mapDispatchToProps)(Thumbnail)
