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

export const ICE_SERVERS = [
  {
    urls: 'stun:mmt-stun.verkstad.net',
  },
  {
    urls: 'turn:static.verkstad.net:443?transport=tcp',
    username: 'openwebrtc',
    credential: 'secret',
  },
  {urls: 'stun:23.21.150.121'},
  {urls:'stun:stun1.l.google.com:19302'},
  {urls:'stun:stun2.l.google.com:19302'},
  {urls:'stun:stun3.l.google.com:19302'},
  {
    urls: 'TURN:192.75.89.50:3478?transport=udp',
    credential : 'ericsson246',
    username: 'ericsson246',
  },
  {
    urls: 'TURN:192.75.89.50:3478?transport=tcp',
    credential : 'ericsson246',
    username: 'ericsson246',
  },
]

export const AUTH_OPTS = {
  serverUrl: 'https://demo.c3.ericsson.net',
}

export const HQ_CONSTRAINTS = {
  video: {
    width: {ideal: 640},
    height: {ideal: 360},
    frameRate: {ideal: 20},
  },
}

export const LQ_CONSTRAINTS = {
  video: {
    width: {ideal: 160},
    height: {ideal: 90},
    frameRate: {max: 10},
  },
}

export const AUDIO_CONSTRAINTS = {
  audio: true,
}
