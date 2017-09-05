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

import React from 'react'
import PropTypes from 'prop-types'
import {Provider} from 'react-redux'
import {BrowserRouter} from 'react-router-dom'

import App from 'containers/App'
import ClientProvider from 'containers/ClientProvider'

const Root = ({client, store}) => (
  <Provider store={store}>
    <ClientProvider client={client}>
      <BrowserRouter>
        <App/>
      </BrowserRouter>
    </ClientProvider>
  </Provider>
)

Root.propTypes = {
  client: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
}

export default Root
