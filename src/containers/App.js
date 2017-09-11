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
import {connect} from 'react-redux'
import {Switch, Route, withRouter} from 'react-router-dom'

import GithubCorner from 'components/GithubCorner'

import ClientBootstrapPage from 'containers/ClientBootstrapPage'
import StartPage from 'containers/StartPage'
const MeetingPage = () => <div>Meeting</div> // import MeetingPage from 'containers/MeetingPage'
const NotFoundPage = () => <div>Not Found</div> // import NotFoundPage from 'containers/NotFoundPage'

import styles from './App.css'

const App = ({children}) => (
  <div className={styles.app}>
    <GithubCorner url='https://github.com/Ericsson/c3-meet'/>
    <ClientBootstrapPage>
      <Switch>
        <Route exact strict path='/' component={StartPage}/>
        <Route exact strict path='/:meetingId' component={MeetingPage}/>
        <Route path='/' component={NotFoundPage}/>
      </Switch>
    </ClientBootstrapPage>
  </div>
)

App.propTypes = {
  children: PropTypes.node,
}

const mapStateToProps = state => {
  return state
}

export default withRouter(connect(mapStateToProps)(App))
