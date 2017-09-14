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
} from 'actions/constants'

const initialState = {
  meetingCreateName: '',
  meetingJoinName: '',

  joinInProgress: false,
  joinError: null,
}

export default function meetingHistory(state = initialState, action) {
  switch (action.type) {
    case UPDATE_CREATE_MEETING_NAME_INPUT: {
      let {meetingName} = action
      return {...state, meetingCreateName: meetingName}
    }
    case UPDATE_JOIN_MEETING_NAME_INPUT: {
      let {meetingName} = action
      return {...state, meetingJoinName: meetingName}
    }
    case MEETING_SETUP_STARTED: {
      return {
        ...state,
        joinInProgress: true,
        joinError: null,
        meetingCreateName: '',
        meetingJoinName: '',
      }
    }
    case MEETING_SETUP_COMPLETE: {
      return {...state, joinInProgress: false, joinError: null}
    }
    case MEETING_SETUP_FAILED: {
      let {error} = action
      return {...state, joinInProgress: false, joinError: error}
    }
    default:
      return state
  }
}
