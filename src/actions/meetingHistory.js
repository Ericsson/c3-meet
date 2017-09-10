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
  SET_MEETING_LIST,
  SORT_MEETING_LIST,
} from 'actions/constants'

import * as store from 'modules/meetingStore'

export function loadMeetingList({orderBy = 'name', descending = true} = {}) {
  let meetings = store.loadMeetingsList()
  store.sortMeetings({meetings, orderBy, descending})
  return {type: SET_MEETING_LIST, meetings}
}

export function sortMeetingsList({orderBy = 'name', descending = true} = {}) {
  return {type: SORT_MEETING_LIST, orderBy, descending}
}

export function addMeeting(options) {
  let updatedMeetingsList = store.addMeeting(options)
  return {type: SET_MEETING_LIST, meetings: updatedMeetingsList}
}

export function removeMeeting(meeringId) {
  let updatedMeetingsList = store.removeMeeting(meeringId)
  if (!updatedMeetingsList) {
    return null
  } else {
    return {type: SET_MEETING_LIST, meetings: updatedMeetingsList}
  }
}
