
import {iceServers} from 'modules/config'
import {Client} from '@cct/libcct'

export default function configureClient() {
  let client = new Client({iceServers})
  window.client = client
  return client
}
