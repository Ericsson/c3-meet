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

import styles from './App.css'
import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Switch, Route, withRouter} from 'react-router-dom'

import BootstrapPage from 'containers/BootstrapPage'
const StartPage = () => <div>Start</div> // import StartPage from 'containers/StartPage'
const MeetingPage = () => <div>Meeting</div> // import MeetingPage from 'containers/MeetingPage'
const NotFoundPage = () => <div>Not Found</div> // import NotFoundPage from 'containers/NotFoundPage'

const App = ({children}) => (
  <div className={styles.app}>
    <BootstrapPage>
      <Switch>
        <Route exact path='/' component={StartPage}/>
        <Route exact path='/:meetingId' component={MeetingPage}/>
        <Route path='/' component={NotFoundPage}/>
      </Switch>
    </BootstrapPage>
  </div>
)

App.propTypes = {
  children: PropTypes.node,
}

const mapStateToProps = state => {
  return state
}

export default withRouter(connect(mapStateToProps)(App))
