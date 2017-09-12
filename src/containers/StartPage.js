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

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import classNames from 'classnames'

import {authenticateClient} from 'actions/client'

import GithubCorner from 'components/GithubCorner'
import WhiteBox from 'components/WhiteBox'

import MeetingCreateForm from 'containers/MeetingCreateForm'
import MeetingJoinForm from 'containers/MeetingJoinForm'
import MeetingHistory from 'containers/MeetingHistory'

import styles from './StartPage.css'

class StartPage extends Component {
  render() {
    return (
      <div className={classNames(styles.page, styles.row)}>
        <GithubCorner url='https://github.com/Ericsson/c3-meet'/>
        <div className={styles.column}>
          <WhiteBox>
            <span className={styles.title}>Ericsson C3 Meet</span>
            <WhiteBox.Divider/>
            <MeetingCreateForm/>
          </WhiteBox>
          <WhiteBox>
            <MeetingJoinForm/>
          </WhiteBox>
        </div>
        <div className={styles.column}>
          <WhiteBox>
            <span className={styles.header}>Meeting history</span>
            <MeetingHistory/>
          </WhiteBox>
        </div>
      </div>
    )
  }
}

StartPage.propTypes = {
  authenticateClient: PropTypes.func.isRequired,
  client: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  client: state.client.client,
})

const mapDispatchToProps = dispatch => ({
  authenticateClient: client => dispatch(authenticateClient(client)),
})

export default connect(mapStateToProps, mapDispatchToProps)(StartPage)
