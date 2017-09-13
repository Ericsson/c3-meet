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
  UPDATE_CLIENT,
  AUTHENTICATE_CLIENT_STARTED,
  AUTHENTICATE_CLIENT_COMPLETE,
  AUTHENTICATE_CLIENT_FAILED,
  SET_STORED_DISPLAY_NAME,
  UPDATE_DISPLAY_NAME_INPUT,
  SET_DISPLAY_NAME_STARTED,
  SET_DISPLAY_NAME_COMPLETE,
  SET_DISPLAY_NAME_FAILED,
} from 'actions/constants'

import {clientAnonymousAuth, setDisplayName, storeDisplayName, getStoredDisplayName} from 'modules/auth'

export function updateClient(client) {
  let user = client ? client.user : null
  return {
    type: UPDATE_CLIENT,
    client: client,
    ownUser: user,
    displayName: user ? user.name : null,
    connectionState: client ? client.state : null,
  }
}

export function authenticateClient(client) {
  return (dispatch, getState) => {
    let {client} = getState().client

    let storedDisplayName = getStoredDisplayName()

    dispatch({type: SET_STORED_DISPLAY_NAME, storedDisplayName})
    dispatch({type: AUTHENTICATE_CLIENT_STARTED})

    clientAnonymousAuth({client}).then(() => {
      dispatch({type: AUTHENTICATE_CLIENT_COMPLETE})

      // If we had a stored display name or it was set before we got here, then we can
      // set it directly, otherwise we let submitDisplayName be called elsewhere.
      let {storedDisplayName} = getState().client
      if (storedDisplayName) {
        submitDisplayName(storedDisplayName)(dispatch, getState)
      }
    }).catch(error => {
      dispatch({type: AUTHENTICATE_CLIENT_FAILED, error})
    })
  }
}

export function updateDisplayNameInput(displayName) {
  return {type: UPDATE_DISPLAY_NAME_INPUT, displayName}
}

export function submitDisplayName(displayName) {
  return (dispatch, getState) => {
    let {client} = getState().client

    storeDisplayName(displayName)
    dispatch({type: SET_STORED_DISPLAY_NAME, storedDisplayName: displayName})

    if (client.authInfo) {
      dispatch({type: SET_DISPLAY_NAME_STARTED})
      setDisplayName({client, displayName}).then(() => {
        dispatch({type: SET_DISPLAY_NAME_COMPLETE, displayName})
      }).catch(error => {
        dispatch({type: SET_DISPLAY_NAME_FAILED, error})
      })
    }
  }
}
