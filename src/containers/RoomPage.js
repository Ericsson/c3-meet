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

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import Video from 'components/Video'
import MuteToggle from 'components/MuteToggle'
import parseUa from 'vigour-ua'
import {
  log,
  Client,
  DataShare,
  DeviceSource,
  Auth,
  webRtcReady,
  MuteFilter,
  StreamSplitter,
  ThumbnailBroadcaster,
  MediaBroadcaster,
} from '@cct/libcct'
import * as cct from '@cct/libcct'
import {devtools} from '@cct/libcct/devtools'
const {RelayTreeVisualization} = devtools
import {
  AUTH_OPTS,
  CLIENT_OPTS,
  MEDIA_CONSTRAINTS,
} from 'modules/constants'

const THUMBNAIL_BROADCASTER = 'meet_broadcaster_video'
const AUDIO_BROADCASTER = 'meet_broadcaster_audio'
const DATA_SHARE = 'data_share'

window.cct = cct

class Visualization extends Component {
  constructor(props) {
    super(props)
    this._onSvgRef = this._onSvgRef.bind(this)
    this._onRelayLinksUpdate = this._onRelayLinksUpdate.bind(this)
  }

  _onSvgRef(svg) {
    if (svg) {
      this._visualization = new RelayTreeVisualization({width: 400, height: 400, svg})
      this._visualization.setRelayLinks(conference.switcher._relayLinks)
      this._visualization.start()
      conference.switcher.on('_relayLinks', this._onRelayLinksUpdate)
      window.visualization = this._visualization
    } else {
      conference.switcher.off('_relayLinks', this._onRelayLinksUpdate)
      this._visualization.setRelayLinks({ids: [], parents: []})
      window.visualization = null
    }
  }

  _onRelayLinksUpdate() {
    this._visualization.setRelayLinks(conference.switcher._relayLinks)
  }

  render() {
    return <svg className='relayTreeVisualization' ref={this._onSvgRef}/>
  }
}

class PeerConnectionState extends Component {
  constructor(props) {
    super(props)
    this._onChange = this._onChange.bind(this)
    this.state = {
      connectionState: this.props.peer.connectionState,
    }
  }
  componentWillMount() {
    this.props.peer.on('connectionState', this._onChange)
  }
  componentWillUnmount() {
    this.props.peer.off('connectionState', this._onChange)
  }
  _onChange(connectionState) {
    this.setState({connectionState})
  }
  render() {
    return <span className='peerConnectionState'>{this.state.connectionState}</span>
  }
}

class ElementHolder extends Component {
  constructor(props) {
    super(props)
    this._onContainerRef = this._onContainerRef.bind(this)
  }
  componentDidMount() {
    this._ref.appendChild(this.props.element)
    if (this.props.element.play) {
      this.props.element.play()
        .catch(error => log('meet', `thumbnail play error, ${error}`))
    }
  }
  shouldComponentUpdate(nextProps) {
    return this.props.element !== nextProps.element
  }
  componentWillReceiveProps(nextProps) {
    this._ref.removeChild(this.props.element)
    this._ref.appendChild(nextProps.element)
    if (nextProps.element.play) {
      nextProps.element.play()
        .catch(error => log('meet', `thumbnail play error, ${error}`))
    }
  }
  componentWillUnmount() {
    if (this._ref.children.length) {
      this._ref.removeChild(this.props.element)
    }
  }
  _onContainerRef(ref) {
    this._ref = ref
  }
  render() {
    return <div {...this.props} ref={this._onContainerRef}/>
  }
}

const Thumbnail = ({element, peer, userAgent}) => {
  var userAgentText = null
  if (userAgent) {
    let {browser, version, platform, device} = userAgent
    userAgentText = (
      <div className='userAgentText'>
        {`${browser} ${version}, ${device} ${platform}`}
      </div>
    )
  }

  let onContainerRef = ref => {
    if (ref) {
      ref.appendChild(element)
    }
  }

  return (
    <div className='thumbnailContainer'>
      {peer && <PeerConnectionState peer={peer}/>}
      {element && <ElementHolder className='thumbnailHolder' element={element}/>}
      {element && <div className='userIdText'>{element.peerId}</div>}
      {userAgentText}
    </div>
  )
}

class RoomPage extends Component {
  constructor(props) {
    super(props)
    this._onKeyDown = this._onKeyDown.bind(this)

    this.handleThumbnailUpdate = this.handleThumbnailUpdate.bind(this)
    this.handleAudioBroadcastSources = this.handleAudioBroadcastSources.bind(this)
    this.state = {
      switcher: null,
      thumbnails: [],
      audioBroadcasters: [],
      showVisualizer: false,
    }
    this.client = new Client(CLIENT_OPTS)
  }

  componentWillMount() {
    let roomName = this.props.match.params.roomName
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
        log.setLogLevel('thumbnail-broadcaster', log.ALL)

        console.log('CONFERENCE SETUP!')
        const conference = room.startConference({switcherMode: 'automatic'})
        this.conference = conference
        window.room = room
        window.conference = conference

        this.mediaSource = new DeviceSource(MEDIA_CONSTRAINTS)
        this.streamSplitter = new StreamSplitter()
        this.mediaSource.connect(this.streamSplitter)
        this.videoSource = this.streamSplitter.videoOutput
        this.audioSource = this.streamSplitter.audioOutput
        this.mutableAudioSource = new MuteFilter()
        this.audioSource.connect(this.mutableAudioSource)

        // set up thumbnails
        this.thumbnailBroadcaster = new ThumbnailBroadcaster({
          projectionConfiguration: {
            width: 100,
            aspectRatio: 16 / 9,
            contentMode: 'aspectFill',
          },
          videoFrameRate: 10,
          imageFrameRate: 2,
        })
        this.videoSource.connect(this.thumbnailBroadcaster)
        this.thumbnailRenderer = this.thumbnailBroadcaster.createRenderer({
          elementClass: 'thumbnail',
        })
        conference.attach(THUMBNAIL_BROADCASTER, this.thumbnailBroadcaster)
        this.thumbnailRenderer.on('elements', this.handleThumbnailUpdate)
        window.thumbnails = this.thumbnailBroadcaster

        const userAgent = this.userAgent = parseUa(navigator.userAgent)
        const dataShare = this.dataShare = new DataShare({ownerId: this.client.user.id})
        conference.attach(DATA_SHARE, dataShare)
        dataShare.set(this.client.user.id, userAgent)
        dataShare.on('update', this.handleThumbnailUpdate)

        this.peers = conference.peers
        this.peers.on('update', this.handleThumbnailUpdate)

        // set up audio
        const audioBroadcaster = this.audioBroadcaster = new MediaBroadcaster()
        this.mutableAudioSource.connect(audioBroadcaster)
        audioBroadcaster.on('added', this.handleAudioBroadcastSources)
        conference.attach(AUDIO_BROADCASTER, audioBroadcaster)

        // set up switcher
        this.videoSource.connect(conference.switcher)
        conference.switcher.on('speaker', speaker => {
          console.log('speaker set: ', speaker)
        })

        this.setState({
          switcher: conference.switcher,
          thumbnails: [{source: this.videoSource, userAgent}],
        })
      })

    document.addEventListener('keydown', this._onKeyDown)
  }

  componentWillUnmount() {
    document.title = 'Meet'
    this.peers.off('update', this.handleThumbnailUpdate)
    this.dataShare.off('update', this.handleThumbnailUpdate)
    this.thumbnailRenderer.off('elements', this.handleThumbnailUpdate)
    this.audioBroadcaster.off('added', this.handleAudioBroadcastSources)
    this.hdCamera.stop()
    this.sdCamera.stop()
    this.microphone.stop()
    this.conference.detach(THUMBNAIL_BROADCASTER)
    this.conference.detach(AUDIO_BROADCASTER)
    this.conference.detach(DATA_SHARE)
    this.conference.close()
    this.client.logout()
    document.removeEventListener('keydown', this._onKeyDown)
  }

  handleThumbnailUpdate(elements) {
    if (Array.isArray(elements)) {
      this.elements = elements
    } else {
      elements = this.elements || []
    }
    elements.slice().sort((a, b) => {
      return parseInt(b.peerId, 10) - parseInt(a.peerId, 10)
    })
    let selfIndex = elements.findIndex(el => el.peerId === this.conference.ownId)
    let [selfElement] = elements.splice(selfIndex, 1)
    if (selfElement) {
      elements.unshift(selfElement)
    }

    let thumbnails = elements.map(element => {
      let userAgent = this.dataShare.get(element.peerId)
      let peer = this.conference.peers.get(element.peerId)
      return {element, peer, userAgent}
    })

    this.setState({thumbnails})
  }

  handleAudioBroadcastSources(added) {
    added.forEach(source => {
      source.connect(new Audio())
    })
  }

  _onKeyDown(event) {
    if (event.key === 'v') {
      this.setState({showVisualizer: !this.state.showVisualizer})
    }
  }

  render() {
    const {switcher, thumbnails, audioBroadcasters, showVisualizer} = this.state

    return (
      <div className='roomPage'>
        <div className='mainVideoContainer'>
          <Video source={switcher}/>
        </div>
        <div className='thumbnailRow'>
          {thumbnails.map(props => <Thumbnail {...props}/>)}
        </div>
        <MuteToggle source={this.mutableAudioSource}/>
        {showVisualizer && switcher && <Visualization switcher={switcher}/>}
      </div>
    )
  }
}

RoomPage.propTypes = {
  params: PropTypes.object,
  switchSource: PropTypes.object,
  videoBroadcastSources: PropTypes.arrayOf(PropTypes.object),
}

const mapStateToProps = state => {
  const {switchSource, videoBroadcastSources} = state
  return {
    switchSource,
    videoBroadcastSources,
  }
}

export default connect(mapStateToProps)(withRouter(RoomPage))
