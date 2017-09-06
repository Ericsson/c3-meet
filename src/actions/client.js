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

import {
  SET_CLIENT,
  SET_STORED_DISPLAY_NAME,
  UPDATE_OWN_USER,
  UPDATE_DISPLAY_NAME,
  UPDATE_CLIENT_CONNECTION_STATE,
  AUTHENTICATE_CLIENT_STARTED,
  AUTHENTICATE_CLIENT_COMPLETE,
  AUTHENTICATE_CLIENT_FAILED,
  SET_DISPLAY_NAME_STARTED,
  SET_DISPLAY_NAME_COMPLETE,
  SET_DISPLAY_NAME_FAILED,
} from 'actions/constants'

import {clientAnonymousAuth, setDisplayName, getStoredDisplayName} from 'modules/auth'

export function setClient(client) {
  return {type: SET_CLIENT, client}
}

export function loadStoredDisplayName() {
  let storedDisplayName = getStoredDisplayName()
  return {type: SET_STORED_DISPLAY_NAME, storedDisplayName}
}

export function updateOwnUser(ownUser) {
  return {type: UPDATE_OWN_USER, ownUser}
}

export function updateDisplayName(displayName) {
  return {type: UPDATE_DISPLAY_NAME, displayName}
}

export function updateClientConnectionState(connectionState) {
  return {type: UPDATE_CLIENT_CONNECTION_STATE, connectionState}
}

export function authenticateClient(client) {
  return (dispatch, getState) => {
    let {client} = getState().client

    dispatch({type: AUTHENTICATE_CLIENT_STARTED})
    clientAnonymousAuth({client}).then(() => {
      dispatch({type: AUTHENTICATE_CLIENT_COMPLETE})
    }).catch(error => {
      dispatch({type: AUTHENTICATE_CLIENT_FAILED, error})
    })
  }
}

export function setClientDisplayName(displayName = null) {
  return (dispatch, getState) => {
    let {client} = getState().client

    dispatch({type: SET_DISPLAY_NAME_STARTED, displayName})

    setDisplayName({client, displayName}).then(() => {
      dispatch({type: SET_DISPLAY_NAME_COMPLETE, displayName})
    }).catch(error => {
      dispatch({type: SET_DISPLAY_NAME_FAILED, error})
    })
  }
}
