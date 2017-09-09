
import {iceServers, logLevel, appLogLevel, LOG_TAG} from 'modules/config'
import {Client, log} from '@cct/libcct'

log.color = true
log.setLogLevel(logLevel)
log.setLogLevel(LOG_TAG, appLogLevel)

export default function configureClient() {
  let client = new Client({iceServers})
  window.client = client
  return client
}
