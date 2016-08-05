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
  constructor(audioBroadcaster) {
    super()
    this.handleRemoteSource = this.handleRemoteSource.bind(this)
    this.handleInterval = this.handleInterval.bind(this)

    this.audioBroadcaster = audioBroadcaster
  }

  rtcComponentWillAttach (attachPoint) {
    this.audioMeters = []
    let meter = new AudioMeter()
    this.audioBroadcaster.input.connect(meter)
    this.audioMeters.push({
      peer: attachPoint.ownId,
      meter,
    })
    this.audioBroadcaster.on('remoteSource', this.handleRemoteSource)
    this.interval = setInterval(this.handleInterval, SWITCHING_INTERVAL_MS)
  }

  rtcComponentWillDetach () {
    clearInterval(this.interval)
    this.audioBroadcaster.off('remoteSource', this.handleRemoteSource)
  }

  handleRemoteSource ({source, peer}) {
    if (source) {
      let audioMeter = new AudioMeter()
      audioMeter.source = source
      this.audioMeters.push({
        peer,
        meter: audioMeter,
      })
    } else {
      this.audioMeters = this.audioMeters.filter(m => m.peer !== peer)
    }
  }

  handleInterval () {
    let members = [this.attachPoint.ownId]
    this.attachPoint.peers.forEach((_, peer) => members.push(peer))

    let shouldHandleSwitching = members.sort()[0] === this.attachPoint.ownId
    const isAlive = ({peer}) => members.includes(peer)
    const byAudioLevelDesc = (a, b) => b.meter.filtered - a.meter.filtered
    if (shouldHandleSwitching) {
      let loudest = this.audioMeters.filter(isAlive).sort(byAudioLevelDesc)[0]
      if (loudest) {
        this.setActive(loudest.peer)
      }
    }
  }
}

export default AudioSwitcher
