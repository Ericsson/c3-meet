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

const SESSION_STORE_KEY = 'meet-session'
const sessionStore = sessionStorage


function loadSession() {
  let json = sessionStore.getItem(SESSION_STORE_KEY)
  if (!json) {
    return null
  }

  try {
    let session = JSON.parse(json)
    argCheck.object('loadSession', 'session', session)
    return session
  } catch (error) {
    if (error) {
      log.error(LOG_TAG, `failed to load session, ${error}`)
    }
    return null
  }
}

// Store an object of {[meetingId]: {meetingName, meetingTime}}
function storeSession(session) {
  argCheck.object('storeSession', 'session', session)
  try {
    let json = JSON.stringify(session)
    sessionStore.setItem(SESSION_STORE_KEY, json)
  } catch (error) {
    log.error(LOG_TAG, `failed to store session, ${error}`)
  }
}

function clearSession() {
  sessionStore.removeItem(SESSION_STORE_KEY)
}

function trySavedSession(client) {
  return Promise.resolve().then(() => {
    let session = loadSession()
    if (!session) {
      throw new Error('no saved session')
    }
    return client.auth(session)
  })
}

export function login({client, displayName}) {
  return trySavedSession().catch(error => {
    log.info(LOG_TAG, `did not use saved session: ${error}`)
    return Auth.anonymous({serverUrl}).then(client.auth)
  }).then(client => {
    // Check if name should not be set, or if it is already set
    if ((!displayName && !client.user.name) || displayName === client.user.name) {
      return client
    } else {
      return client.setName(displayName).catch(error => {
        log.error(LOG_TAG, `failed to set display name, ${error}`)
      }).then(() => client)
    }
  })
}

export function logout(client) {
  if (client.user) {
    log.info(LOG_TAG, `logging out user: '${client.user.id}'`)
  } else {
    log.info(LOG_TAG, `logging client without user`)
  }
  client.logout()
  return clearSession()
}

// Keeping login and register here for now, not used atm
export function loginWithPassword({client, username, password}) {
  log.info(LOG_TAG, `attempting to log in user: '${username}'`)
  return Auth.loginWithPassword({
    serverUrl, username, password,
  })
    .then(client.auth)
    .then(() => {
      saveAuthInfo(client.authInfo)
    })
}

export function register({client, displayName, username, password}) {
  log.info('Register', `attempting to register user: '${username}' with display name '${displayName}'`)

  let name = username

  return Auth.registerWithPassword({
    serverUrl: serverUrl,
    username: username,
    password: password
  }).then(() => {
    log.info(info)
    log.info(LOG_TAG, `registration successful for '${username}'`)
    log.info('Client', 'Signing in user')

    return client.setName(name)
  }).catch(error => {
    log.error(LOG_TAG, `failed to register user, ${error}`)
  })
}
