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
  ACQUIRE_MEETING_MEDIA_STARTED,
  ACQUIRE_MEETING_MEDIA_COMPLETE,
  ACQUIRE_MEETING_MEDIA_FAILED,
} from 'actions/constants'

import {LOG_TAG} from 'modules/config'
import {log, DeviceSource} from '@cct/libcct'

export function acquireMediaDevices() {
  return (dispatch, getState) => {
    if (getState().meetingMedia.ready) {
      log.info(LOG_TAG, 'meeting media is already set up')
      return
    }
    let source = new DeviceSource({video: true, audio: true})
    dispatch({type: ACQUIRE_MEETING_MEDIA_STARTED})

    source.promise.then(() => {
      dispatch({type: ACQUIRE_MEETING_MEDIA_COMPLETE, source})
    }, error => {
      dispatch({type: ACQUIRE_MEETING_MEDIA_FAILED, error})
    })
  }
}
