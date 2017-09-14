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

import {LOG_TAG} from 'modules/config'
import {log} from '@cct/libcct'
import argCheck from '@cct/arg-check'

import {SingleValueStore} from 'modules/storage'

export const meetingStore = new SingleValueStore({
  store: localStorage,
  key: 'meet-stored-meetings',
})

export function addMeeting(meeting) {
  argCheck.options('addMeeting', 'meeting', meeting)
    .string('id')
    .string('name')

  let meetings = meetingStore.load() || {}

  meetings[meeting.id] = {
    name: meeting.name,
    time: new Date().toISOString(),
  }

  meetingStore.store(meetings)
}

export function removeMeetingById(meetingId) {
  if (!meetingId) {
    throw new TypeError(`Invalid meetingId: '${meetingId}'`)
  }

  let meetings = meetingStore.load()

  let deleted = delete meetings[meetingId]
  if (deleted) {
    meetingStore.store(meetings)
  }
  return deleted
}

// Mutates the meetings array
export function sortMeetings({meetings, orderBy = 'name', descending = true}) {
  if (orderBy === 'name') {
    sortMeetingsByName(meetings, descending)
  } else if (orderBy === 'time') {
    sortMeetingsByTime(meetings, descending)
  } else {
    throw new TypeError(`unknown orderBy parameters for sortMeetings: '${orderBy}'`)
  }
}

function sortMeetingsByTime(meetings, descending = true) {
  if (descending) {
    meetings.sort((a, b) => {
      return b.meetingTime.getTime() - a.meetingTime.getTime()
    })
  } else {
    meetings.sort((a, b) => {
      return a.meetingTime.getTime() - b.meetingTime.getTime()
    })
  }
}

function sortMeetingsByName(meetings, descending = true) {
  let order = Math.sign(descending - 0.5)
  meetings.sort((a, b) => {
    if (a.meetingName < b.meetingName) {
      return -1 * order
    }
    if (a.meetingName > b.meetingName) {
      return 1 * order
    }
    return 0
  })
}

export function clear() {
  meetingStore.clear()
}

export function loadMeetingsList() {
  let obj = meetingStore.load()
  let meetingList = []

  if (typeof(obj) !== 'object' || obj === null) {
    return meetingList
  }

  for (let id of Object.keys(obj)) {
    let {name, time} = obj[id]

    let meetingTime = new Date(time)
    if (isNaN(meetingTime.getTime())) {
      log.error(LOG_TAG, `failed to load meeting '${id}'/'${name}', invalid date: '${time}'`)
      continue
    }

    meetingList.push({
      meetingId: id,
      meetingName: name,
      meetingTime,
    })
  }

  return meetingList
}
