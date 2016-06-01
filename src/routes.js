import React from 'react'
import {Route, IndexRoute} from 'react-router'
import App from './containers/App'
import SetupPage from './containers/SetupPage'
import RoomPage from './containers/RoomPage'
import AboutPage from './containers/AboutPage'

export default (
  <Route path="/" component={App}>
    <IndexRoute component={SetupPage}/>
    <Route path="/setup" component={SetupPage}/>
    <Route path="/room/:roomName" component={RoomPage}/>
    <Route path="/about" component={AboutPage}/>
  </Route>
)
