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
  MEETING_SETUP_COMPLETE,
  LEAVE_MEETING,
  CONFERENCE_CONNECTION_STATE,
  CONFERENCE_CONNECTION_ERROR,
  USER_AGENT_SHARE_UPDATE,
} from 'actions/constants'

import parseUa from 'vigour-ua'

const initialState = {
  room: null,
  ownId: null,
  conference: null,
  connectionState: null,
  errors: [],
  userAgentShare: null,
  peerUserAgents: {},
}

function clearState({room, conference, unsubscribe}) {
  if (unsubscribe) {
    unsubscribe()
  }
  if (room) {
    room.leave()
  }
  if (conference) {
    conference.close()
  }
}

export default function meetingHistory(state = initialState, action) {
  switch (action.type) {
    case MEETING_SETUP_COMPLETE: {
      let {room, ownId, conference, connectionState, userAgentShare, unsubscribe} = action

      let userAgent = parseUa(navigator.userAgent)
      userAgentShare.set(ownId, userAgent)
      let peerUserAgents = {}
      userAgentShare.forEach((value, key) => (peerUserAgents[key] = value))

      window.conference = conference
      window.room = room
      window.ownId = ownId
      return {...state, room, ownId, conference, connectionState, userAgentShare, peerUserAgents, unsubscribe}
    }
    case LEAVE_MEETING: {
      clearState(state)
      window.conference = null
      window.room = null
      window.ownId = null
      return initialState
    }
    case CONFERENCE_CONNECTION_STATE: {
      let {connectionState} = action
      return {...state, connectionState}
    }
    case CONFERENCE_CONNECTION_ERROR: {
      let {error} = action
      return {...state, errors: [...state.errors, error]}
    }
    case USER_AGENT_SHARE_UPDATE: {
      let {key, value} = action
      return {...state, peerUserAgents: {...state.peerUserAgents, [key]: value}}
    }
    default:
      return state
  }
}
