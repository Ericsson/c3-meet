
import {log, version} from '@cct/libcct'

import {getRuntimeConfig} from 'modules/runtimeConfig'

const runtimeConfig = getRuntimeConfig()

window.version = process.env.VERSION
window.version.cct = version
window.version.config = runtimeConfig.env // For easier debugging

export const serverUrl = runtimeConfig.readString('SERVER_URL', {defaultValue: `https://${location.hostname}`})
export const statsUrl = runtimeConfig.readString('STATS_URL', {defaultValue: null})

// 1: error, 2: warning, 4: info, 8: debug, 16: verbose
export const logLevel = runtimeConfig.readNumber('LOG_LEVEL', {defaultValue: log.DEBUG})
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

export const LOG_TAG = 'meet'
