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
import MuteToggle from '../components/MuteToggle'
import parseUa from 'vigour-ua'
import {
  Client,
  DataShare,
  DeviceSource,
  Auth,
  webRtcReady,
  MediaBroadcaster,
} from '@cct/libcct'
import {
  AUTH_OPTS,
  CLIENT_OPTS,
  HQ_CONSTRAINTS,
  LQ_CONSTRAINTS,
  AUDIO_CONSTRAINTS,
} from '../utils/constants'

const MEDIA_SWITCHER = 'meet_switcher'
const VIDEO_BROADCASTER = 'meet_broadcaster_video'
const AUDIO_BROADCASTER = 'meet_broadcaster_audio'
const DATA_SHARE = 'data_share'

const Thumbnail = ({source, peer, userAgent}) => {
  var video
  if (peer) {
    video = <Video key={peer} source={source}/>
  } else {
    video = <Video key='' source={source} className='thumbnailSelfView'/>
  }
  var userAgentText = null
  if (userAgent) {
    let {browser, version, platform, device} = userAgent
    userAgentText = (
      <div className='userAgentText'>
        {`${browser} ${version}, ${device} ${platform}`}
      </div>
    )
  }
  return (
    <div className='thumbnailContainer'>
      {video}
      {userAgentText}
    </div>
  )
}

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
    this.client = new Client(CLIENT_OPTS)
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

      const sdCamera = this.sdCamera = new DeviceSource(LQ_CONSTRAINTS)
      const videoBroadcaster = this.videoBroadcaster = new MediaBroadcaster()
      sdCamera.connect(videoBroadcaster)
      videoBroadcaster.on('remoteSources', this.handleVideoBroadcastSources)
      conference.attach(VIDEO_BROADCASTER, videoBroadcaster)

      const userAgent = this.userAgent = parseUa(navigator.userAgent)
      const dataShare = this.dataShare = new DataShare({ownerId: this.client.user.id})
      conference.attach(DATA_SHARE, dataShare)
      dataShare.set(this.client.user.id, userAgent)
      dataShare.on('update', this.handleVideoBroadcastSources)

      this.setState({
        switcher,
        videoBroadcasters: [{source: sdCamera, userAgent}],
      })
    })
  }

  componentWillUnmount () {
    document.title = 'Meet'
    this.dataShare.off('update', this.handleVideoBroadcastSources)
    this.videoBroadcaster.off('remoteSources', this.handleVideoBroadcastSources)
    this.audioBroadcaster.off('remoteSources', this.handleAudioBroadcastSources)
    this.hdCamera.stop()
    this.sdCamera.stop()
    this.microphone.stop()
    this.conference.detach(MEDIA_SWITCHER)
    this.conference.detach(VIDEO_BROADCASTER)
    this.conference.detach(AUDIO_BROADCASTER)
    this.conference.detach(DATA_SHARE)
    this.conference.close()
    this.client.logout()
  }

  handleVideoBroadcastSources () {
    let videoBroadcasters = [{source: this.sdCamera, userAgent: this.userAgent}]
    for (let peer in this.videoBroadcaster.remoteSources) {
      let userAgent = this.dataShare.get(peer)
      videoBroadcasters.push({
        peer,
        source: this.videoBroadcaster.remoteSources[peer],
        userAgent,
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
        <div className="thumbnailRow">
          {videoBroadcasters.map(props => <Thumbnail {...props}/>)}
        </div>
        {audioBroadcasters.map(({source, peer}) => (
          <Audio key={peer} source={source}/>
        ))}
        <MuteToggle source={this.microphone}/>
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
