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
import classNames from 'classnames'

import {removeMeetingById} from 'actions/meetingHistory'

import MeetingList from 'components/MeetingList'

import styles from './MeetingHistory.css'

const MeetingHistory = ({className, ...props}) => (
  <MeetingList className={classNames(styles.list, className)} {...props}/>
)

MeetingHistory.propTypes = {
  ...MeetingList.propTypes,
}

const mapStateToProps = state => ({
  meetings: state.meetingHistory.meetings,
})

const mapDispatchToProps = dispatch => ({
  onRemove: meetingId => dispatch(removeMeetingById(meetingId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MeetingHistory)
