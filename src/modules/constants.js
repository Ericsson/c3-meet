/*
Copyright 2017 Ericsson AB.

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

export const CLIENT_OPTS = {
  statsUrl: 'https://data.c3.ericsson.net/stats/',
  iceServers: [{
    urls: 'turn:turn.demo.c3.ericsson.net:443?transport=udp',
    username: 'c3-turn',
    credential: 'see-three',
  }, {
    urls: 'turn:turn.demo.c3.ericsson.net:443?transport=tcp',
    username: 'c3-turn',
    credential: 'see-three',
  }],
}

export const AUTH_OPTS = {
  // serverUrl: 'http://147.214.70.132:7008/2',
  serverUrl: 'https://demo.c3.ericsson.net',
}

export const MEDIA_CONSTRAINTS = {
  video: {
    aspectRatio: 16 / 9,
  },
  audio: true,
}
