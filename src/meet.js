import React from 'react'
import {render} from 'react-dom'
import {browserHistory} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'
import './images/purple.png'
import './fonts/EricssonCapitalTT.ttf'

import configureStore from './store/configureStore'

import Root from './containers/Root'

const store = configureStore()
const history = syncHistoryWithStore(browserHistory, store)

render(
  <Root store={store} history={history}/>,
  document.getElementById('root')
)
