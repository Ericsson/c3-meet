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

import {connect} from 'react-redux'

import {togglePeerMute} from 'actions/meetingMedia'

import Thumbnail from 'components/Thumbnail'

const mapStateToProps = ({meeting, meetingMedia, meetingPeers}, {peerId}) => {
  let peer = meetingPeers.peers[peerId] || null
  let user = meetingPeers.onlineMembers[peerId]
  return {
    displayName: user ? user.name : '',
    muted: !!meetingMedia.mutedPeers[peerId],
    element: meetingMedia.thumbnailElements[peerId] || null,
    connectionState: peer ? peer.connectionState : null,
    errorState: peer ? peer.errorState : null,
    userAgent: meeting.peerUserAgents[peerId] || null,
    hasMutedSelf: !!meetingMedia.peersWithMute[peerId],
  }
}

const mapDispatchToProps = (dispatch, {peerId}) => ({
  toggleMute: () => dispatch(togglePeerMute({peerId})),
})

export default connect(mapStateToProps, mapDispatchToProps)(Thumbnail)
