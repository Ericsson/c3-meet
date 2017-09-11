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
import {withRouter} from 'react-router'

import {joinMeeting, leaveMeeting} from 'actions/meetingSetup'

import ErrorMessage from 'components/ErrorMessage'
import LoadingPage from 'components/LoadingPage'
import WhiteBox from 'components/WhiteBox'

import MeetingPage from 'containers/MeetingPage'

import styles from './MeetingBootstrapPage.css'

class MeetingBootstrapPage extends Component {
  componentWillMount() {
    let {meetingName} = this.props.match.params
    this.props.joinMeeting({meetingName, navigate: false})
  }

  render() {
    let {props} = this

    if (props.joinError) {
      return (
        <WhiteBox>
          <ErrorMessage error={props.joinError} className={styles.error}/>
        </WhiteBox>
      )
    }
    if (!props.room) {
      return <LoadingPage/>
    }
    return <MeetingPage/>
  }
}

MeetingBootstrapPage.propTypes = {
  joinInProgress: PropTypes.bool.isRequired,
  joinMeeting: PropTypes.func.isRequired,

  joinError: PropTypes.object,
}

const mapStateToProps = state => ({
  joinInProgress: state.meetingSetup.joinInProgress,
  joinError: state.meetingSetup.joinError,
  room: state.meeting.room,
})

const mapDispatchToProps = dispatch => ({
  joinMeeting: meetingName => dispatch(joinMeeting(meetingName)),
  leaveMeeting: meetingName => dispatch(leaveMeeting(meetingName)),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MeetingBootstrapPage))
