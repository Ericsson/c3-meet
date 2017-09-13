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
  LOAD_MEETING_LIST,
  SORT_MEETING_LIST,
  REMOVE_MEETING_FROM_LIST,
  CREATE_MEETING_COMPLETE,
  MEETING_SETUP_COMPLETE,
} from 'actions/constants'

import {loadMeetingsList, sortMeetings, addMeeting, removeMeetingById} from 'modules/meetingStore'

const initialState = {
  meetings: [],
  orderBy: 'time',
  descending: true,
}

function loadMeetings(state) {
  let meetings = loadMeetingsList()
  let {orderBy, descending} = state
  sortMeetings({meetings, orderBy, descending})
  return meetings
}

export default function meetingHistory(state = initialState, action) {
  switch (action.type) {
    case LOAD_MEETING_LIST: {
      return {...state, meetings: loadMeetings(state)}
    }
    case SORT_MEETING_LIST: {
      let {orderBy, descending} = action
      let meetings = state.meetings.slice()
      sortMeetings({meetings, orderBy, descending})
      return {...state, orderBy, descending, meetings}
    }
    case REMOVE_MEETING_FROM_LIST: {
      let {meetingId} = action
      let updated = removeMeetingById(meetingId)
      if (updated) {
        return {...state, meetings: loadMeetings(state)}
      } else {
        return {...state}
      }
    }
    case MEETING_SETUP_COMPLETE: {
      addMeeting(action.room)
      return {...state, meetings: loadMeetings(state)}
    }
    default:
      return state
  }
}
