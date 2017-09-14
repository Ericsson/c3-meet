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

import React from 'react'
import PropTypes from 'prop-types'
import {Provider} from 'react-redux'
import {ConnectedRouter} from 'react-router-redux'

import App from 'containers/App'
import TitleProvider from 'containers/TitleProvider'
import ClientProvider from 'containers/ClientProvider'
import GlobalDispatchProvider from 'containers/GlobalDispatchProvider'

const Root = ({client, store, history}) => (
  <Provider store={store}>
    <GlobalDispatchProvider>
      <TitleProvider>
        <ClientProvider client={client}>
          <ConnectedRouter history={history}>
            <App/>
          </ConnectedRouter>
        </ClientProvider>
      </TitleProvider>
    </GlobalDispatchProvider>
  </Provider>
)

Root.propTypes = {
  client: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
}

export default Root
