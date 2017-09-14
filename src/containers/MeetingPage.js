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

import * as icons from 'react-feather'

import {toggleMute} from 'actions/meetingMedia'

import ThumbnailContainer from 'components/ThumbnailContainer'
import Video from 'components/Video'

import SelfViewThumbnail from 'containers/SelfViewThumbnail'
import PeerThumbnail from 'containers/PeerThumbnail'

import styles from './MeetingPage.css'

class MeetingPage extends Component {
  render() {
    let {className, ownId, peers, muted, mainVideo, toggleMute} = this.props
    let Mic = muted ? icons.MicOff : icons.Mic
    return (
      <div className={classNames(styles.page, className)}>
        <div className={styles.thumbnails}>
          <ThumbnailContainer>
            {[ownId, ...Object.keys(peers)].sort().map(peerId => (
              peerId === ownId
              ? <SelfViewThumbnail key={peerId}/>
              : <PeerThumbnail key={peerId} peerId={peerId}/>
            ))}
          </ThumbnailContainer>
        </div>
        <div className={styles.main}>
          <div className={styles.mainVideo}>
            <Video muted={true} source={mainVideo}/>
          </div>
          <div className={styles.controls}>
            <Mic className={styles.controlIcon} onClick={toggleMute}/>
            <icons.Video className={styles.controlIcon}/>
            <icons.Monitor className={styles.controlIcon}/>
            <icons.PhoneOff className={styles.controlIcon}/>
          </div>
        </div>
      </div>
    )
  }
}

MeetingPage.propTypes = {
}

const mapStateToProps = state => ({
  ownId: state.meeting.ownId,
  peers: state.meetingPeers.peers,
  muted: state.meetingMedia.muted,
  mainVideo: state.meetingMedia.remoteVideoSource,
})

const mapDispatchToProps = dispatch => ({
  toggleMute: () => dispatch(toggleMute()),
})

export default connect(mapStateToProps, mapDispatchToProps)(MeetingPage)
