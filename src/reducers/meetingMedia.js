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
  MEETING_SETUP_STARTED,
  MEETING_SETUP_COMPLETE,
  LEAVE_MEETING,
  ACQUIRE_MEETING_MEDIA_STARTED,
  ACQUIRE_MEETING_MEDIA_COMPLETE,
  ACQUIRE_MEETING_MEDIA_FAILED,
} from 'actions/constants'

const initialState = {
  conference: null,
  localSwitcherSource: null,
  remoteSwitcherSource: null,
  error: null,
  ready: false,
  waiting: false,
}

export default function meetingHistory(state = initialState, action) {
  switch (action.type) {
    case MEETING_SETUP_COMPLETE: {
      let {conference} = action
      let remoteSwitcherSource = conference.switcher

      let {localSwitcherSource} = state
      if (localSwitcherSource) {
        localSwitcherSource.connect(conference.switcher)
      }

      return {...state, conference, remoteSwitcherSource}
    }
    case LEAVE_MEETING: {
      return {...state, conference: null, remoteSwitcherSource: null}
    }
    case ACQUIRE_MEETING_MEDIA_STARTED: {
      let {localSwitcherSource} = state
      if (localSwitcherSource) {
        localSwitcherSource.stop()
      }
      return {...state, waiting: true, localSwitcherSource: null, ready: false}
    }
    case ACQUIRE_MEETING_MEDIA_COMPLETE: {
      let localSwitcherSource = action.source

      let {conference} = state
      if (conference) {
        localSwitcherSource.connect(conference.switcher)
      }

      return {...state, waiting: false, localSwitcherSource, ready: true}
    }
    case ACQUIRE_MEETING_MEDIA_FAILED: {
      let {error} = action
      return {...state, waiting: false, error}
    }
    default:
      return state
  }
}
