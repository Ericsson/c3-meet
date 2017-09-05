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

import {LOG_TAG} from 'modules/config'
import {log} from '@cct/libcct'
import argCheck from '@cct/arg-check'

const MEETING_STORE_KEY = 'meet-session'
const meetingStore = localStorage

export function addMeeting({meetingId, meetingName, meetingTime}) {
  if (!meetingId) {
    throw new TypeError(`Invalid meetingId: '${meetingId}'`)
  }
  if (!meetingName) {
    throw new TypeError(`Invalid meetingName: '${meetingName}'`)
  }
  if (!meetingTime) {
    throw new TypeError(`Invalid meetingTime: '${meetingTime}'`)
  }

  let meetings = loadMeetings()

  meetings[meetingId] = {meetingName, meetingTime}

  storeMeetings(meetings)
}

export function removeMeeting(meetingId) {
  if (!meetingId) {
    throw new TypeError(`Invalid meetingId: '${meetingId}'`)
  }

  let meetings = loadMeetings()

  let deleted = delete(meetings[meetingId])
  if (deleted) {
    storeMeetings(meetings)
  }
  return deleted
}

export function listMeetingsByTime(ascending) {
  let sorted = meetingList.sort((a, b) => {
    return a.meetingTime - b.meetingTime
  })

  if (!ascending) {
    sorted.reverse()
  }

  return sorted
}

export function listMeetingsByName(ascending) {
  let sorted = meetingList.sort((a, b) => {
    if (a.meetingName < b.meetingName) {
      return -1
    }
    if ( a.meetingName > b.meetingName) {
      return 1
    }
    return 0
  })

  if (!ascending) {
    sorted.reverse()
  }

  return sorted
}

export function clear() {
  meetingStore.removeItem(MEETING_STORE_KEY)
}

function listMeetings() {
  let obj = loadMeetings()
  let meetingList = []

  for (let meeting of Object.values(obj)) {
    meetingList.push(meeting)
  }

  return meetingList
}

function loadMeetings() {
  let json = meetingStore.getItem(MEETING_STORE_KEY)
  if (!json) {
    return null
  }

  try {
    let meetings = JSON.parse(json)
    argCheck.object('loadMeetings', 'meetings', meetings)
    return meetings
  } catch (error) {
    if (error) {
      log.error(LOG_TAG, `failed to load meeting list, ${error}`)
    }
    return null
  }
}

// Store an object of {[meetingId]: {meetingName, meetingTime}}
function storeMeetings(meetings) {
  argCheck.object('storeMeetings', 'meetings', meetings)
  try {
    let json = JSON.stringify(meetings)
    meetingStore.setItem(MEETING_STORE_KEY, json)
  } catch (error) {
    log.error(LOG_TAG, `failed to store meeting list, ${error}`)
  }
}
