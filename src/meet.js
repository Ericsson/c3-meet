import React from 'react'
import {render} from 'react-dom'
import {browserHistory} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'

import injectTapEventPlugin from 'react-tap-event-plugin'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import theme from './theme'
import configureStore from './store/configureStore'

import Root from './containers/Root'

injectTapEventPlugin()
const store = configureStore()
const history = syncHistoryWithStore(browserHistory, store)

const RootWithTheme = () => (
  <MuiThemeProvider muiTheme={theme}>
    <Root store={store} history={history}/>
  </MuiThemeProvider>
)

render(
  <RootWithTheme/>,
  document.getElementById('root')
)
