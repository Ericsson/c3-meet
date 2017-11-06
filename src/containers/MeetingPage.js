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
import {connect} from 'react-redux'

import {MicOff, Mic} from 'react-feather'

import {toggleMute} from 'actions/meetingMedia'

import ThumbnailContainer from 'components/ThumbnailContainer'
import PersistenceVideoPlayer from 'components/PersistenceVideoPlayer'
import ConferenceVisualization from 'components/ConferenceVisualization'

import OwnThumbnail from 'containers/OwnThumbnail'
import PeerThumbnail from 'containers/PeerThumbnail'
import MemberListPopup from 'containers/MemberListPopup'

import styles from './MeetingPage.css'

const THUMBNAIL_SINGLE_COLUMN_LIMIT = 6

const MeetingPage = props => {
  let {className, ownId, peers, muted, mainVideo, showVisualization, switcher, toggleMute} = props
  let MuteButton = muted ? MicOff : Mic

  let thumbnails = [ownId, ...Object.keys(peers)].sort().map(peerId => (
    peerId === ownId
      ? <OwnThumbnail key={peerId} peerId={ownId}/>
      : <PeerThumbnail key={peerId} peerId={peerId}/>
  ))
  let doubleColumns = thumbnails.length > THUMBNAIL_SINGLE_COLUMN_LIMIT

  return (
    <div className={classNames(styles.page, className)}>
      <div className={classNames(styles.thumbnails, doubleColumns && styles.doubleColumns)}>
        <ThumbnailContainer doubleColumns={doubleColumns}>
          {thumbnails}
        </ThumbnailContainer>
      </div>
      <div className={styles.main}>
        <div className={styles.mainVideo}>
          <PersistenceVideoPlayer source={mainVideo}/>
          {showVisualization && (
            <ConferenceVisualization switcher={switcher} ownId={ownId} className={styles.visualization}/>
          )}
        </div>
        <div className={styles.controls}>
          <MuteButton className={classNames(styles.controlIcon, styles.controlButton)} onClick={toggleMute}/>
          <MemberListPopup className={styles.controlIcon}/>
        </div>
      </div>
    </div>
  )
}

MeetingPage.propTypes = {
  muted: PropTypes.bool.isRequired,
  ownId: PropTypes.string.isRequired,
  peers: PropTypes.object.isRequired,
  showVisualization: PropTypes.bool.isRequired,
  switcher: PropTypes.object.isRequired,
  toggleMute: PropTypes.func.isRequired,
  className: PropTypes.string,
  mainVideo: PropTypes.object,
}

const mapStateToProps = state => ({
  mainVideo: state.meetingMedia.remoteVideoSource,
  muted: state.meetingMedia.muted,
  ownId: state.meeting.ownId,
  peers: state.meetingPeers.peers,
  showVisualization: state.devtools.showVisualization,
  switcher: state.meeting.conference.switcher,
})

const mapDispatchToProps = dispatch => ({
  toggleMute: () => dispatch(toggleMute()),
})

export default connect(mapStateToProps, mapDispatchToProps)(MeetingPage)
