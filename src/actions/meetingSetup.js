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

import {
  UPDATE_CREATE_MEETING_NAME_INPUT,
  UPDATE_JOIN_MEETING_NAME_INPUT,
  MEETING_SETUP_STARTED,
  MEETING_SETUP_COMPLETE,
  MEETING_SETUP_FAILED,
  LEAVE_MEETING,
  ROOM_MEMBER_PRESENCE_CHANGES,
  CONFERENCE_CONNECTION_STATE,
  CONFERENCE_CONNECTION_ERROR,
  CONFERENCE_PEER_UPSERT,
  CONFERENCE_PEER_REMOVED,
  CONFERENCE_SPEAKER_CHANGED,
  CONFERENCE_PEER_AUDIO_ADDED,
  CONFERENCE_PEER_AUDIO_REMOVED,
  CONFERENCE_THUMBNAILS_ADDED,
  CONFERENCE_THUMBNAILS_REMOVED,
  USER_AGENT_SHARE_UPDATE,
  MUTE_STATE_SHARE_UPDATE,
} from 'actions/constants'

import {log, DataShare, MediaBroadcaster, ThumbnailBroadcaster} from '@cct/libcct'
import {push} from 'react-router-redux'

import {
  createMeeting as _createMeeting,
  joinMeeting as _joinMeeting,
} from 'modules/meetingSetup'
import {thumbnailConfig, LOG_TAG} from 'modules/config'
import namegen from 'modules/namegen'

export function generateCreateMeetingName() {
  return {type: UPDATE_CREATE_MEETING_NAME_INPUT, meetingName: namegen()}
}

export function updateCreateMeetingNameInput(meetingName) {
  return {type: UPDATE_CREATE_MEETING_NAME_INPUT, meetingName}
}

export function createMeeting(meetingName) {
  return (dispatch, getState) => {
    let {client, meetingSetup} = getState()
    if (meetingSetup.joinInProgress) {
      return
    }

    dispatch({type: LEAVE_MEETING})
    dispatch({type: MEETING_SETUP_STARTED, meetingName})
    dispatch(push(`/${meetingName}`))

    _createMeeting({client: client.client, meetingName}).then(room => {
      dispatch({type: MEETING_SETUP_COMPLETE, ...initializeConference(room, dispatch, getState)})
    }, error => {
      dispatch({type: MEETING_SETUP_FAILED, error})
    }).catch(error => log.error(LOG_TAG, `create conference initialization threw error, ${error}`))
  }
}

export function updateJoinMeetingNameInput(meetingName) {
  return {type: UPDATE_JOIN_MEETING_NAME_INPUT, meetingName}
}

export function joinMeeting({meetingName, navigate = false}) {
  return (dispatch, getState) => {
    let {client, meetingSetup, meeting} = getState()
    if (meetingSetup.joinInProgress) {
      return
    }
    if (meeting.room && meeting.room.name === meetingName) {
      if (navigate) {
        dispatch(push(`/${meetingName}`))
      }
      return
    }

    dispatch({type: LEAVE_MEETING})
    dispatch({type: MEETING_SETUP_STARTED, meetingName})
    if (navigate) {
      dispatch(push(`/${meetingName}`))
    }

    _joinMeeting({client: client.client, meetingName}).then(room => {
      dispatch({type: MEETING_SETUP_COMPLETE, ...initializeConference(room, dispatch, getState)})

      let online = []
      let offline = []
      room.members.forEach(user => {
        if (user.presence === 'offline') {
          offline.push(user)
        } else {
          online.push(user)
        }
      })
      dispatch({type: ROOM_MEMBER_PRESENCE_CHANGES, online, offline})
    }, error => {
      dispatch({type: MEETING_SETUP_FAILED, error})
    }).catch(error => log.error(LOG_TAG, `join conference initialization threw error, ${error}`))
  }
}

export function leaveMeeting() {
  return (dispatch, getState) => {
    let {meeting} = getState()
    if (meeting.room) {
      meeting.room.leave()
      dispatch({type: ROOM_MEMBER_PRESENCE_CHANGES, offline: [meeting.room.members]})
      dispatch({type: LEAVE_MEETING})
    }
  }
}

function initializeConference(room, dispatch, getState) {
  let conference = room.startConference({
    switcherMode: 'automatic',
  })
  let {ownId, connectionState} = conference
  let hasUnsubscribed = false

  let audioBroadcaster = new MediaBroadcaster()

  let thumbnailBroadcaster = new ThumbnailBroadcaster(thumbnailConfig)
  let thumbnailRenderer = thumbnailBroadcaster.createRenderer()

  let userAgentShare = new DataShare({ownerId: ownId})

  let muteStateShare = new DataShare({ownerId: ownId})

  function onConnectionState(connectionState) {
    dispatch({type: CONFERENCE_CONNECTION_STATE, connectionState})
  }

  function onError(error) {
    log.error(LOG_TAG, `encountered conference error, ${error}`)
    dispatch({type: CONFERENCE_CONNECTION_ERROR, error})
  }

  function onPeerAdded(peerId, peer) {
    const onUpdate = () => {
      if (hasUnsubscribed) {
        return
      }
      dispatch({
        type: CONFERENCE_PEER_UPSERT,
        peerId,
        errorState: peer.errorState,
        connectionState: peer.connectionState,
      })
    }
    peer.on('connectionState', onUpdate)
    peer.on('errorState', onUpdate)

    dispatch({
      type: CONFERENCE_PEER_UPSERT,
      peerId,
      errorState: peer.errorState,
      connectionState: peer.connectionState,
    })
  }

  function onRoomMemberPresence(presence) {
    let user = this
    if (presence === 'offline') {
      dispatch({type: ROOM_MEMBER_PRESENCE_CHANGES, offline: [user]})
    } else {
      dispatch({type: ROOM_MEMBER_PRESENCE_CHANGES, online: [user]})
    }
  }

  function onRoomMemberJoined(user) {
    user.on('presence', onRoomMemberPresence)

    if (user.presence === 'offline') {
      dispatch({type: ROOM_MEMBER_PRESENCE_CHANGES, offline: [user]})
    } else {
      dispatch({type: ROOM_MEMBER_PRESENCE_CHANGES, online: [user]})
    }
  }

  function onRoomMemberLeft(user) {
    user.off('presence', onRoomMemberPresence)
    dispatch({type: ROOM_MEMBER_PRESENCE_CHANGES, offline: [user]})
  }

  function onPeerRemoved(peerId) {
    dispatch({type: CONFERENCE_PEER_REMOVED, peerId})
  }

  function onSpeakerChanged(speakerId) {
    dispatch({type: CONFERENCE_SPEAKER_CHANGED, speakerId})
  }

  function onPeerAudioAdded(sources) {
    dispatch({type: CONFERENCE_PEER_AUDIO_ADDED, sources})
  }

  function onPeerAudioRemoved(sources) {
    dispatch({type: CONFERENCE_PEER_AUDIO_REMOVED, sources})
  }

  function onThumbnailsAdded(elements) {
    dispatch({type: CONFERENCE_THUMBNAILS_ADDED, elements})
  }

  function onThumbnailsRemoved(elements) {
    dispatch({type: CONFERENCE_THUMBNAILS_REMOVED, elements})
  }

  function onUserAgentShareUpdate(update) {
    dispatch({type: USER_AGENT_SHARE_UPDATE, ...update})
  }
  function onMuteStateShareUpdate(update) {
    dispatch({type: MUTE_STATE_SHARE_UPDATE, ...update})
  }

  conference.on('connectionState', onConnectionState)
  conference.on('error', onError)
  conference.peers.on('added', onPeerAdded)
  conference.peers.on('removed', onPeerRemoved)
  conference.switcher.on('speaker', onSpeakerChanged)
  audioBroadcaster.on('added', onPeerAudioAdded)
  audioBroadcaster.on('removed', onPeerAudioRemoved)
  thumbnailRenderer.on('added', onThumbnailsAdded)
  thumbnailRenderer.on('removed', onThumbnailsRemoved)
  userAgentShare.on('update', onUserAgentShareUpdate)
  muteStateShare.on('update', onMuteStateShareUpdate)
  room.on('join', onRoomMemberJoined)
  room.on('leave', onRoomMemberLeft)

  let unsubscribe = () => {
    room.off('join', onRoomMemberJoined)
    room.off('leave', onRoomMemberLeft)
    conference.off('connectionState', onConnectionState)
    conference.off('error', onError)
    conference.peers.off('added', onPeerAdded)
    conference.peers.off('removed', onPeerRemoved)
    conference.switcher.off('speaker', onSpeakerChanged)
    audioBroadcaster.off('added', onPeerAudioAdded)
    audioBroadcaster.off('removed', onPeerAudioRemoved)
    thumbnailRenderer.off('added', onThumbnailsAdded)
    thumbnailRenderer.off('removed', onThumbnailsRemoved)
    userAgentShare.off('update', onUserAgentShareUpdate)
    muteStateShare.off('update', onMuteStateShareUpdate)
    hasUnsubscribed = true
  }

  conference.attach('audio', audioBroadcaster)
  conference.attach('thumbnails', thumbnailBroadcaster)
  conference.attach('userAgent', userAgentShare)
  conference.attach('muteState', muteStateShare)

  return {
    room,
    ownId,
    conference,
    audioBroadcaster,
    thumbnailBroadcaster,
    thumbnailRenderer,
    connectionState,
    userAgentShare,
    muteStateShare,
    unsubscribe,
  }
}
