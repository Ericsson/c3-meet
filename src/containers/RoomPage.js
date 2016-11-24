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

import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import Video from '../components/Video'
import Audio from '../components/Audio'
import AudioSwitcher from '../components/AudioSwitcher'
import {
  Client,
  DeviceSource,
  Auth,
  webRtcReady,
  MediaBroadcaster,
} from '@cct/libcct'
import {
  AUTH_OPTS,
  ICE_SERVERS,
  HQ_CONSTRAINTS,
  LQ_CONSTRAINTS,
  AUDIO_CONSTRAINTS,
} from '../utils/constants'

const MEDIA_SWITCHER = 'meet_switcher'
const VIDEO_BROADCASTER = 'meet_broadcaster_video'
const AUDIO_BROADCASTER = 'meet_broadcaster_audio'

class RoomPage extends Component {
  constructor (props) {
    super(props)
    this.handleVideoBroadcastSources = this.handleVideoBroadcastSources.bind(this)
    this.handleAudioBroadcastSources = this.handleAudioBroadcastSources.bind(this)
    this.state = {
      switcher: null,
      videoBroadcasters: [],
      audioBroadcasters: [],
    }
    this.client = new Client({
      iceServers: ICE_SERVERS,
    })
  }

  componentWillMount () {
    let roomName = this.props.params.roomName
    document.title = `Meet - ${roomName}`
    const client = this.client
    webRtcReady()
    .then(() => Auth.anonymous(AUTH_OPTS))
    .then(client.auth)
    .then(() => client.fetchRoomByAlias(roomName))
    .then(room => room.join())
    .catch(() => client.createRoom({
      name: roomName,
      joinRule: 'open',
      alias: roomName,
    }))
    .then(room => {
      const conference = this.conference =  room.startConference()

      const microphone = this.microphone = new DeviceSource(AUDIO_CONSTRAINTS)
      const audioBroadcaster = this.audioBroadcaster = new MediaBroadcaster()
      microphone.connect(audioBroadcaster)
      audioBroadcaster.on('remoteSources', this.handleAudioBroadcastSources)
      conference.attach(AUDIO_BROADCASTER, audioBroadcaster)

      const hdCamera = this.hdCamera = new DeviceSource(HQ_CONSTRAINTS)
      const switcher = new AudioSwitcher(audioBroadcaster)
      hdCamera.connect(switcher)
      conference.attach(MEDIA_SWITCHER, switcher)
      this.setState({switcher})

      const sdCamera = this.sdCamera = new DeviceSource(LQ_CONSTRAINTS)
      const videoBroadcaster = this.videoBroadcaster = new MediaBroadcaster()
      sdCamera.connect(videoBroadcaster)
      videoBroadcaster.on('remoteSources', this.handleVideoBroadcastSources)
      conference.attach(VIDEO_BROADCASTER, videoBroadcaster)
    })
  }

  componentWillUnmount () {
    document.title = 'Meet'
    this.videoBroadcaster.off('remoteSources', this.handleVideoBroadcastSources)
    this.audioBroadcaster.off('remoteSources', this.handleAudioBroadcastSources)
    this.hdCamera.stop()
    this.sdCamera.stop()
    this.microphone.stop()
    this.conference.detach(MEDIA_SWITCHER)
    this.conference.detach(VIDEO_BROADCASTER)
    this.conference.detach(AUDIO_BROADCASTER)
    this.conference.close()
    this.client.logout()
  }

  handleVideoBroadcastSources (sources) {
    let videoBroadcasters = []
    for (let peer in sources) {
      videoBroadcasters.push({
        peer,
        source: sources[peer],
      })
    }
    this.setState({videoBroadcasters})
  }

  handleAudioBroadcastSources (sources) {
    let audioBroadcasters = []
    for (let peer in sources) {
      audioBroadcasters.push({
        peer,
        source: sources[peer],
      })
    }
    this.setState({audioBroadcasters})
  }

  render () {
    const {switcher, videoBroadcasters, audioBroadcasters} = this.state
    return (
      <div className="roomPage">
        <div className="mainVideoContainer">
          <Video source={switcher}/>
        </div>
        {videoBroadcasters.length < 2 ? null :
          <div className="thumbnailContainer">
          {videoBroadcasters.map(({source, peer}) => (
            <Video key={peer} source={source}/>
          ))}
          </div>
        }
        {audioBroadcasters.map(({source, peer}) => (
          <Audio key={peer} source={source}/>
        ))}
      </div>
    )
  }
}

RoomPage.propTypes = {
  params: PropTypes.object,
  switchSource: PropTypes.object,
  videoBroadcastSources: PropTypes.arrayOf(PropTypes.object),
}

const mapStateToProps = (state) => {
  const {switchSource, videoBroadcastSources} = state
  return {
    switchSource,
    videoBroadcastSources,
  }
}

export default connect(mapStateToProps)(RoomPage)
