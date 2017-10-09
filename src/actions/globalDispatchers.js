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
  BEFORE_UNLOAD,
  LOAD_MEETING_LIST,
  MEDIA_TOGGLE_MUTE,
  DEVTOOLS_TOGGLE_VISUALIZATION,
} from 'actions/constants'

import {meetingStore} from 'modules/meetingStore'

export function registerGlobalDispatchers(dispatch) {
  return (dispatch, getState) => {
    registerBeforeUnloadDispatcher(dispatch, getState)
    registerLocalStorageDispatcher(dispatch, getState)
    registerKeypressDispatcher(dispatch, getState)
  }
}

function registerBeforeUnloadDispatcher(dispatch, getState) {
  window.addEventListener('beforeunload', () => {
    dispatch({type: BEFORE_UNLOAD})
  })
}

function registerLocalStorageDispatcher(dispatch, getState) {
  window.addEventListener('storage', event => {
    if (meetingStore.matchEvent(event)) {
      return dispatch({type: LOAD_MEETING_LIST})
    }
  })
}

function registerKeypressDispatcher(dispatch, getState) {
  document.addEventListener('keydown', event => {
    if (event.code === 'KeyM') {
      dispatch({type: MEDIA_TOGGLE_MUTE})
    }
    if (event.code === 'KeyV') {
      dispatch({type: DEVTOOLS_TOGGLE_VISUALIZATION})
    }
  })
}
