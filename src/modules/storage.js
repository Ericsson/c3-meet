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

import {LOG_TAG} from 'modules/config'
import {log} from '@cct/libcct'
import argCheck from '@cct/arg-check'

export class SingleValueStore {
  // sessionStorage or localStorage
  constructor(options) {
    argCheck.options('storeObject', 'options', options)
      .string('key')
      .object('store')

    this._key = options.key
    this._store = options.store
  }

  store(obj) {
    try {
      let json = JSON.stringify(obj)
      this._store.setItem(this._key, json)
    } catch (error) {
      log.error(LOG_TAG, `failed to store object, ${error}`)
    }
  }

  load() {
    let json = this._store.getItem(this._key)
    if (!json) {
      return null
    }

    try {
      return JSON.parse(json)
    } catch (error) {
      if (error) {
        log.error(LOG_TAG, `failed to load object, ${error}`)
      }
      return null
    }
  }

  clear() {
    this._store.removeItem(this._key)
  }

  matchEvent(event) {
    return event.storageArea === this._store && event.key === this._key
  }
}
