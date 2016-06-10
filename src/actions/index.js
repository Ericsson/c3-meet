import {
  Client,
  DeviceSource,
  Auth,
  webRtcReady,
  MediaSwitcher,
  MediaBroadcaster,
  log,
} from '@cct/libcct'

const AUTH_OPTS = {
  serverUrl: 'http://192.168.99.100:8008',
}

const HQ_CONSTRAINTS = {
  video: {
    width: {ideal: 640},
    height: {ideal: 360},
    frameRate: {ideal: 20},
  },
}

const LQ_CONSTRAINTS = {
  video: {
    width: {ideal: 160},
    height: {ideal: 90},
    frameRate: {max: 10},
  },
  audio: true,
}

export const MEDIA_SWITCHER = 'MEDIA_SWITCHER'
export const ADD_VIDEO_BROADCASTER = 'ADD_VIDEO_BROADCASTER'
export const REMOVE_VIDEO_BROADCASTER = 'REMOVE_VIDEO_BROADCASTER'

export const startCCT = (roomName) => {
  return dispatch => {
    const client = new Client()
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
      const camera = new DeviceSource(HQ_CONSTRAINTS)
      const conference = room.startConferenceCall()
      const switcher = new MediaSwitcher()
      switcher.source = camera
      dispatch({
        type: MEDIA_SWITCHER,
        switcher,
      })
      conference.attach('sw', switcher)
      switcher.setActive()

      const sdCamera = new DeviceSource(LQ_CONSTRAINTS)
      const videoBroadcaster = new MediaBroadcaster()
      videoBroadcaster.source = sdCamera
      videoBroadcaster.on('remoteSource', ({peer, source}) => dispatch({
        type: ADD_VIDEO_BROADCASTER,
        source,
        peer,
      }))
      conference.attach('vbc', videoBroadcaster)
    })
  }
}
