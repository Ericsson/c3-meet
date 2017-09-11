/*
Copyright 2016 Ericsson AB.

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
  CREATE_MEETING_STARTED,
  CREATE_MEETING_COMPLETE,
  CREATE_MEETING_FAILED,
  UPDATE_JOIN_MEETING_NAME_INPUT,
  JOIN_MEETING_STARTED,
  JOIN_MEETING_COMPLETE,
  JOIN_MEETING_FAILED,
} from 'actions/constants'

import {push} from 'react-router-redux'

import {
  createMeeting as _createMeeting,
  joinMeeting as _joinMeeting,
} from 'modules/meetingSetup'
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

    dispatch({type: JOIN_MEETING_STARTED, meetingName})
    dispatch(push(`/${meetingName}`))

    _createMeeting({client: client.client, meetingName}).then(meeting => {
      dispatch({type: JOIN_MEETING_COMPLETE, meeting})
    }, error => {
      dispatch({type: JOIN_MEETING_FAILED, error})
    })
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

    dispatch({type: JOIN_MEETING_STARTED, meetingName})
    if (navigate) {
      dispatch(push(`/${meetingName}`))
    }

    _joinMeeting({client: client.client, meetingName}).then(meeting => {
      dispatch({type: JOIN_MEETING_COMPLETE, meeting})
    }, error => {
      dispatch({type: JOIN_MEETING_FAILED, error})
    })
  }
}
