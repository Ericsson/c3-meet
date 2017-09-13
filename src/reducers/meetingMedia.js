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
  MEETING_SETUP_STARTED,
  MEETING_SETUP_COMPLETE,
  LEAVE_MEETING,
  ACQUIRE_MEETING_MEDIA_STARTED,
  ACQUIRE_MEETING_MEDIA_COMPLETE,
  ACQUIRE_MEETING_MEDIA_FAILED,
  CONFERENCE_PEER_AUDIO_ADDED,
  CONFERENCE_PEER_AUDIO_REMOVED,
  CONFERENCE_THUMBNAILS_ADDED,
  CONFERENCE_THUMBNAILS_REMOVED,
} from 'actions/constants'

import {MuteFilter, StreamSplitter} from '@cct/libcct'

const initialState = {
  conference: null,
  source: null,
  audioBroadcaster: null,
  thumbnailBroadcaster: null,
  remoteVideoSource: null,
  muteFilter: null,
  error: null,
  ready: false,
  waiting: false,
  mutedSelf: false,
  mutedPeers: {},
  audioSources: {},
  thumbnailElements: {},
}

function connectConferenceMedia({conference, source, audioBroadcaster, thumbnailBroadcaster, mutedSelf}) {
  let streamSplitter = new StreamSplitter()
  let {videoOutput, audioOutput} = streamSplitter
  let muteFilter = new MuteFilter()
  muteFilter.muted = mutedSelf

  source.connect(streamSplitter)
  audioOutput.connect(muteFilter)
  muteFilter.connect(audioBroadcaster)
  videoOutput.connect(conference.switcher)
  videoOutput.connect(thumbnailBroadcaster)

  return {muteFilter}
}

export default function meetingHistory(state = initialState, action) {
  switch (action.type) {
    case MEETING_SETUP_COMPLETE: {
      let {conference, audioBroadcaster, thumbnailBroadcaster} = action

      let {source} = state
      let setupResult = {}
      if (source) {
        setupResult = connectConferenceMedia({...state, ...action})
      }

      let remoteVideoSource = conference.switcher

      return {...state, ...setupResult, conference, audioBroadcaster, thumbnailBroadcaster, remoteVideoSource}
    }
    case LEAVE_MEETING: {
      let {source} = state
      if (source) {
        source.stop()
      }
      return initialState
    }
    case ACQUIRE_MEETING_MEDIA_STARTED: {
      let {source} = state
      if (source) {
        source.stop()
      }
      return {...state, waiting: true, ready: false, source: null, error: null}
    }
    case ACQUIRE_MEETING_MEDIA_COMPLETE: {
      let {source} = action

      let {conference} = state
      let setupResult = {}
      if (conference) {
        setupResult = connectConferenceMedia({...state, ...action})
      }

      return {...state, waiting: false, source, ready: true, ...setupResult}
    }
    case ACQUIRE_MEETING_MEDIA_FAILED: {
      let {error} = action
      return {...state, waiting: false, error}
    }
    case CONFERENCE_THUMBNAILS_ADDED: {
      let {elements} = action
      let addedObj = action.elements.reduce((obj, el) => (obj[el.peerId] = el, obj), {})
      return {...state, thumbnailElements: {...state.thumbnailElements, ...addedObj}}
    }
    case CONFERENCE_THUMBNAILS_REMOVED: {
      let thumbnailElements = {...state.thumbnailElements}
      action.elements.forEach(({peerId}) => delete(thumbnailElements[peerId]))
      return {...state, thumbnailElements}
    }
    case CONFERENCE_PEER_AUDIO_ADDED: {
      let {sources} = action
      let {mutedPeers, audioSources} = state

      let addedSources = {}
      sources.forEach(source => {
        let audio = new Audio()
        source.connect(audio)
        source.muted = !!mutedPeers[source.peerId]
        addedSources[peerId] = source
      })

      return {...state, audioSources: {...audioSources, ...addedSources}}
    }
    case CONFERENCE_PEER_AUDIO_REMOVED: {
      let {sources} = action
      let {...audioSources} = state.audioSources

      sources.forEach(({peerId}) => delete(audioSources[peerId]))

      return {...state, audioSources}
    }
    default:
      return state
  }
}
