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
import classNames from 'classnames'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

import {leaveMeeting} from 'actions/meetingSetup'

import styles from './OngoingMeetingBox.css'

const OngoingMeetingBox = ({className, meetingName, leaveMeeting}) => {
  if (!meetingName) {
    return null
  }

  return (
    <div className={classNames(styles.box, className)}>
      <span className={styles.header}>Ongoing meeting</span>
      <span className={styles.text}>
        Head back to {<Link className={styles.link} to={`/${meetingName}`}>{meetingName}</Link>}
        {' or '}
        <span className={classNames(styles.link, styles.leaveLink)} onClick={leaveMeeting}>
          leave meeting
        </span>
      </span>
    </div>
  )
}

OngoingMeetingBox.propTypes = {
  leaveMeeting: PropTypes.func.isRequired,
  className: PropTypes.string,
  meetingName: PropTypes.string,
}

const mapStateToProps = state => ({
  meetingName: state.meeting.room ? state.meeting.room.name : null,
})

const mapDispatchToProps = dispatch => ({
  leaveMeeting: () => dispatch(leaveMeeting()),
})

export default connect(mapStateToProps, mapDispatchToProps)(OngoingMeetingBox)
