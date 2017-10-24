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
  MEDIA_PERMISSION_STARTED,
  MEDIA_PERMISSION_COMPLETE,
  MEDIA_PERMISSION_FAILED,
  SET_AVAILABLE_DEVICES,
  SELECT_MEDIA_DEVICE,
  CONFIRM_MEDIA_DEVICE_SELECTION,
} from 'actions/constants'

import {log, DeviceSource} from '@cct/libcct'

import {LOG_TAG} from 'modules/config'

export function checkMediaPermissions() {
  return dispatch => {
    DeviceSource.queryPermissions().then(permissions => {
      let {audio, video} = permissions
      if (audio !== 'forbidden' && video !== 'forbidden') {
        dispatch({type: MEDIA_PERMISSION_COMPLETE, permissions})
      }
    }).catch(error => {
      log.error(LOG_TAG, `failed to check for media permissions, ${error}`)
    })
  }
}

export function requestMediaPermissions() {
  return dispatch => {
    dispatch({type: MEDIA_PERMISSION_STARTED})

    DeviceSource.requestPermissions({audio: true, video: true}).then(permissions => {
      dispatch({type: MEDIA_PERMISSION_COMPLETE, permissions})
    }).catch(error => {
      dispatch({type: MEDIA_PERMISSION_FAILED, error})
    })
  }
}

export function enumerateDevices() {
  return dispatch => {
    DeviceSource.enumerateDevices().then(devices => {
      dispatch({type: SET_AVAILABLE_DEVICES, devices})
    })
  }
}

export function selectMediaDevices(selection = {}) {
  return {type: SELECT_MEDIA_DEVICE, ...selection}
}

export function confirmMediaDeviceSelection() {
  return {type: CONFIRM_MEDIA_DEVICE_SELECTION}
}
