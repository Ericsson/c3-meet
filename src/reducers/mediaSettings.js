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

import {NotAllowedUserMediaError} from 'modules/errors'

const initialState = {
  permissions: null,
  havePermissions: false,
  permissionError: null,
  audioInputDevices: [],
  videoInputDevices: [],
  haveEnumeratedDevices: false,
  selectedAudioDevice: null,
  selectedVideoDevice: null,
  haveSelectedMediaDevices: false,
}

export default function meetingHistory(state = initialState, action) {
  switch (action.type) {
    case MEDIA_PERMISSION_STARTED: {
      return {...state, permissions: null, permissionError: null, havePermissions: false}
    }
    case MEDIA_PERMISSION_COMPLETE: {
      let {permissions} = action

      if (permissions.audio === 'forbidden' || permissions.video === 'forbidden') {
        let permissionError = new NotAllowedUserMediaError(`Device permissions request was not fully accepted`)
        return {...state, permissions: null, permissionError, havePermissions: false}
      } else {
        return {...state, permissions, permissionError: null, havePermissions: true}
      }
    }
    case MEDIA_PERMISSION_FAILED: {
      let {error} = action
      return {...state, permissions: null, permissionError: error, havePermissions: false}
    }
    case SET_AVAILABLE_DEVICES: {
      let {devices} = action
      let audioInputDevices = devices.filter(({kind}) => kind === 'audioinput')
      let videoInputDevices = devices.filter(({kind}) => kind === 'videoinput')
      return {
        ...state,
        audioInputDevices,
        videoInputDevices,
        selectedAudioDevice: audioInputDevices[0],
        selectedVideoDevice: videoInputDevices[0],
        haveEnumeratedDevices: true,
      }
    }
    case SELECT_MEDIA_DEVICE: {
      let {audio, video} = action
      let newState = {...state}
      if (typeof(audio) !== 'undefined') {
        newState.selectedAudioDevice = audio
      }
      if (typeof(video) !== 'undefined') {
        newState.selectedVideoDevice = video
      }
      return newState
    }
    case CONFIRM_MEDIA_DEVICE_SELECTION: {
      return {...state, haveSelectedMediaDevices: true}
    }
    default:
      return state
  }
}
