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

import {serverUrl, LOG_TAG} from 'modules/config'
import {log, Auth} from '@cct/libcct'
import argCheck from '@cct/arg-check'

import {
  AnonymousAuthError,
  AuthRequestError,
  AuthResponseError,
  NameRequestError,
  UnknownError,
} from 'modules/errors'

import {SingleValueStore} from 'modules/storage'

const sessionStore = new SingleValueStore({
  store: sessionStorage,
  key: 'meet-session',
})

const displayNameStore = new SingleValueStore({
  store: localStorage,
  key: 'meet-display-name',
})

function trySavedSession(client) {
  return Promise.resolve().then(() => {
    let session = sessionStore.load()
    if (!session) {
      throw new Error('no saved session')
    }
    return client.auth(session)
  })
}

export function clientAnonymousAuth({client}) {
  return trySavedSession().catch(error => {
    log.info(LOG_TAG, `did not use saved session: ${error}`)
    return Auth.anonymous({serverUrl}).then(authInfo => {
      return client.auth(authInfo).catch(error => {
        if (error.name === 'RequestError') {
          throw new AuthRequestError(error.message)
        } else if (error.name === 'NotAllowedError') {
          throw new AuthResponseError(error.message)
        } else {
          throw new UnknownError(error.message)
        }
      })
    }, error => {
      if (error.name === 'AuthenticationError') {
        throw new AnonymousAuthError(error.message)
      } else if (error.name === 'RequestError') {
        throw new AuthRequestError(error.message)
      } else if (error.name === 'NotAllowedError') {
        throw new AnonymousAuthError(error.message)
      } else {
        throw new UnknownError(error.message)
      }
    })
  }).then(client => {
    sessionStore.store(client.authInfo)

    // Try to set the stored display name
    let displayName = displayNameStore.load()
    return setDisplayName({client, displayName})
  })
}

// Client should be authenticated when this is called
export function setDisplayName({client, displayName}) {
  argCheck.optString('setDisplayName', 'displayName', displayName)
  // Check if name should not be set, or if it is already set
  displayNameStore.store(displayName)
  if ((!displayName && !client.user.name) || displayName === client.user.name) {
    return client
  } else {
    return client.setName(displayName).catch(error => {
      log.error(LOG_TAG, `failed to set display name, ${error}`)
      if (error.name === 'RequestError') {
        throw new NameRequestError(error.message)
      } else {
        throw new UnknownError(error.message)
      }
    }).then(() => client)
  }
}

export function getStoredDisplayName() {
  return displayNameStore.load()
}

export function logout(client) {
  argCheck.object('logout', 'client', client)
  if (client.user) {
    log.info(LOG_TAG, `logging out user: '${client.user.id}'`)
  } else {
    log.info(LOG_TAG, 'logging client without user')
  }
  client.logout()
  return sessionStore.clear()
}

// Keeping login and register here for now, not used atm
export function loginWithPassword({client, username, password}) {
  log.info(LOG_TAG, `attempting to log in user: '${username}'`)
  return Auth.loginWithPassword({
    serverUrl, username, password,
  }).then(client.auth)
    .then(() => {
      sessionStore.store(client.authInfo)
    })
}

export function register({client, displayName, username, password}) {
  log.info('Register', `attempting to register user: '${username}' with display name '${displayName}'`)

  let name = username

  return Auth.registerWithPassword({
    serverUrl: serverUrl,
    username: username,
    password: password,
  }).then(() => {
    log.info(LOG_TAG, `registration successful for '${username}'`)

    return client.setName(name)
  }).catch(error => {
    log.error(LOG_TAG, `failed to register user, ${error}`)
  })
}
