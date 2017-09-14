
import {log, version} from '@cct/libcct'

import {getRuntimeConfig} from 'modules/runtimeConfig'

const runtimeConfig = getRuntimeConfig()

window.version = process.env.VERSION
window.version.cct = version
window.version.config = runtimeConfig.env // For easier debugging

export const serverUrl = runtimeConfig.readString('SERVER_URL', {defaultValue: `https://${location.hostname}`})
export const statsUrl = runtimeConfig.readString('STATS_URL', {defaultValue: null})

// 1: error, 2: warning, 4: info, 8: debug, 16: verbose
export const logLevel = runtimeConfig.readNumber('LOG_LEVEL', {defaultValue: log.INFO})
export const appLogLevel = runtimeConfig.readNumber('APP_LOG_LEVEL', {defaultValue: log.ALL})

export const iceServers = [{
  url: 'turn:turn.demo.c3.ericsson.net:443?transport=tcp',
  username: 'c3-turn',
  credential: 'see-three',
}, {
  url: 'turn:turn.demo.c3.ericsson.net:443?transport=udp',
  username: 'c3-turn',
  credential: 'see-three',
}]

export const mediaConstraints = {
  video: {
    aspectRatio: 16 / 9,
    height: {ideal: 720},
  },
  audio: true,
}

export const thumbnailConfig = {
  projectionConfiguration: {
    width: runtimeConfig.readNumber('THUMBNAIL_WIDTH', {defaultValue: 160}),
    aspectRatio: 16 / 9,
    contentMode: 'aspectFill',
  },
  videoFrameRate: runtimeConfig.readNumber('THUMBNAIL_VIDEO_FPS', {defaultValue: 10}),
  imageFrameRate: runtimeConfig.readNumber('THUMBNAIL_IMAGE_FPS', {defaultValue: 2}),
}

export const title = runtimeConfig.readString('TITLE', {defaultValue: 'Ericsson C3 Meet'})

export const LOG_TAG = 'meet'
