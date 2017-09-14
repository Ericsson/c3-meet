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
} from 'actions/constants'

export function loadMeetingList() {
  return {type: LOAD_MEETING_LIST}
}

export function sortMeetingsList({orderBy, descending}) {
  return {type: SORT_MEETING_LIST, orderBy, descending}
}

export function removeMeetingById(meetingId) {
  return {type: REMOVE_MEETING_FROM_LIST, meetingId}
}
