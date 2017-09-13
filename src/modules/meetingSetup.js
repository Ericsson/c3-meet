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

import {
  ForbiddenMeetingError,
  InvalidMeetingNameError,
  MeetingNameConflictError,
  MeetingNotFoundError,
  SessionLostError,
} from 'modules/errors'

export function createMeeting({client, meetingName}) {
  argCheck.object('createMeeting', 'options.client', client)
  argCheck.string('createMeeting', 'options.meetingName', meetingName)

  log.debug(LOG_TAG, `creating new meeting with name '${meetingName}'`)
  return client.createRoom({
    name: meetingName,
    alias: meetingName,
    joinRule: 'open',
    guestAccessRule: 'open',
  }).then(room => {
    log.info(LOG_TAG, `created meeting '${meetingName}'`)
    return room
  }).catch(error => {
    log.info(LOG_TAG, `failed to create meeting '${meetingName}', ${error}`)
    if (error.name === 'ConflictError') {
      throw new MeetingNameConflictError(error.message)
    } else if (error.name === 'InvalidAliasError') {
      throw new InvalidMeetingNameError(error.message)
    } else if (error.name === 'AuthenticationError') {
      throw new SessionLostError(error.message)
    } else {
      // The rest of the errors *should* not happen, so just display
      // them directly in case they do
      throw error
    }
  })
}

export function joinMeeting({client, meetingName}) {
  argCheck.object('createMeeting', 'options.client', client)
  argCheck.string('createMeeting', 'options.meetingName', meetingName)

  log.debug(LOG_TAG, `joining new meeting with name '${meetingName}'`)
  return client.fetchRoomByAlias(meetingName).then(room => {
    return room.join().catch(error => {
      log.info(LOG_TAG, `failed to join meeting '${meetingName}'/'${room.id}', ${error}`)
      if (error.name === 'NotAllowedError') {
        throw new ForbiddenMeetingError(error.message)
      } else {
        throw error
      }
    })
  }, error => {
    log.info(LOG_TAG, `failed to look up meeting '${meetingName}', ${error}`)
    if (error.name === 'NotFoundError') {
      throw new MeetingNotFoundError(error.message)
    } else if (error.name === 'AuthenticationError') {
      throw new SessionLostError(error.message)
    } else {
      throw error
    }
  }).then(room => {
    log.info(LOG_TAG, `joined meeting '${meetingName}'/'${room.id}'`)
    return room
  })
}
