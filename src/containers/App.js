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
import {connect} from 'react-redux'
import {Switch, Route, withRouter} from 'react-router-dom'

import ClientBootstrapPage from 'containers/ClientBootstrapPage'
import StartPage from 'containers/StartPage'
import MeetingBootstrapPage from 'containers/MeetingBootstrapPage'
const NotFoundPage = () => <div>Not Found</div> // import NotFoundPage from 'containers/NotFoundPage'

import styles from './App.css'

const App = () => (
  <div className={styles.app}>
    <ClientBootstrapPage>
      <Switch>
        <Route exact strict path='/' component={StartPage}/>
        <Route exact strict path='/:meetingName' component={MeetingBootstrapPage}/>
        <Route path='/' component={NotFoundPage}/>
      </Switch>
    </ClientBootstrapPage>
  </div>
)

App.propTypes = {
}

const mapStateToProps = state => {
  return state
}

export default withRouter(connect(mapStateToProps)(App))
