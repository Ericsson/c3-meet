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

import {MediaSwitcher, AudioMeter} from '@cct/libcct'

const SWITCHING_INTERVAL_MS = 3000

class AudioSwitcher extends MediaSwitcher {
  constructor(audioBroadcaster, selfId) {
    super()
    this.handleRemoteSource = this.handleRemoteSource.bind(this)
    this.handleInterval = this.handleInterval.bind(this)

    this.selfId = selfId
    this.audioBroadcaster = audioBroadcaster
    this.audioMeters = []
    let meter = new AudioMeter()
    meter.source = audioBroadcaster.source
    this.audioMeters.push({
      peer: selfId,
      meter,
    })
    audioBroadcaster.on('remoteSource', this.handleRemoteSource)
    this.interval = setInterval(this.handleInterval, SWITCHING_INTERVAL_MS)
  }

  handleRemoteSource ({source, peer}) {
    let audioMeter = new AudioMeter()
    audioMeter.source = source
    this.audioMeters.push({
      peer,
      meter: audioMeter,
    })
  }

  handleInterval () {
    let shouldHandleSwitching = this.liveMembers.sort()[0] === this.selfId
    if (shouldHandleSwitching) {
      let loudest = this.audioMeters.filter(am => this.liveMembers.includes(am.peer)).sort((a, b) => a.meter.filtered - b.meter.filtered)[0]
      if (loudest) {
        console.log('SWITCHING TO ' + loudest.peer)
        this.setActive(loudest.peer)
      } else {
        console.log('THERE IS NO LOUDEST')
      }
    }
  }
}

export default AudioSwitcher
