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

import {combineReducers} from 'redux'
import client from 'reducers/client'
import devtools from 'reducers/devtools'
import meeting from 'reducers/meeting'
import meetingHistory from 'reducers/meetingHistory'
import meetingMedia from 'reducers/meetingMedia'
import meetingPeers from 'reducers/meetingPeers'
import meetingSetup from 'reducers/meetingSetup'
import {routerReducer} from 'react-router-redux'

export default combineReducers({
  router: routerReducer,
  client,
  devtools,
  meeting,
  meetingHistory,
  meetingMedia,
  meetingPeers,
  meetingSetup,
})
