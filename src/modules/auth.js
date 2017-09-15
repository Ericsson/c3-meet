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

import {serverUrl, LOG_TAG} from 'modules/config'
import {log, Auth} from '@cct/libcct'

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
  if (client.state === 'connected') {
    log.info(LOG_TAG, `client is already connected as '${client.user.id}'`)
    return Promise.resolve(client)
  }
  return Promise.resolve().then(() => {
    let session = sessionStore.load()
    if (!session) {
      throw new Error('no saved session')
    }
    return client.auth(session).then(client => {
      log.info(LOG_TAG, `used saved session for '${client.user.id}'`)
      return client
    })
  })
}

export function clientAnonymousAuth({client}) {
  return trySavedSession(client).catch(error => {
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
    return client
  })
}

// Client should be authenticated when this is called
export function setDisplayName({client, displayName}) {
  // Check if name should not be set, or if it is already set
  if (!displayName && !client.user.name) {
    log.debug(LOG_TAG, 'no need to set display name, none was requested and none was set')
    return Promise.resolve(client)
  } else if (displayName === client.user.name) {
    log.debug(LOG_TAG, 'no need to set display name, already equal to the requested one')
    return Promise.resolve(client)
  } else {
    log.debug(LOG_TAG, `setting display name to ${displayName}, was ${client.user.name}`)
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

export function storeDisplayName(displayName) {
  displayNameStore.store(displayName)
}

export function getStoredDisplayName() {
  return displayNameStore.load() || ''
}

export function logout(client) {
  if (client.user) {
    log.info(LOG_TAG, `logging out user: '${client.user.id}'`)
  } else {
    log.info(LOG_TAG, 'logging client without user')
  }
  client.logout()
  return sessionStore.clear()
}
