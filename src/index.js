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

import './index.css'

import React from 'react'
import ReactDOM from 'react-dom'
import {AppContainer} from 'react-hot-loader'
import createBrowserHistory from 'history/createBrowserHistory'

window.cct = require('@cct/libcct')

import Root from 'containers/Root'

import configureStore from 'store/configureStore'
import configureClient from './store/configureClient'

const history = createBrowserHistory()
const store = configureStore({history})
const client = configureClient()

const root = document.createElement('div')
document.body.appendChild(root)

const render = Component => {
  let app = (
    <AppContainer>
      <Component store={store} client={client} history={history}/>
    </AppContainer>
  )
  ReactDOM.render(app, root)
}

render(Root)

if (module.hot) {
  module.hot.accept('containers/Root', () => {
    render(Root)
  })
}
