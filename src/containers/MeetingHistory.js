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
import {push} from 'react-router-redux'
import classNames from 'classnames'
import {X} from 'react-feather'

import {removeMeetingById} from 'actions/meetingHistory'

import Button from 'components/Button'
import MeetingList from 'components/MeetingList'

import {formatRelative} from 'modules/intl'

import styles from './MeetingHistory.css'

class MeetingHistory extends Component {
  render() {
    let {className, ...props} = this.props
    return <MeetingList className={classNames(styles.list, className)} {...props}/>
  }
}

MeetingHistory.propTypes = {
  history: PropTypes.object.isRequired,
  ...MeetingList.propTypes,
}

const mapStateToProps = state => ({
  meetings: state.meetingHistory.meetings,
  orderBy: state.meetingHistory.orderBy,
  descending: state.meetingHistory.descending,
})

const mapDispatchToProps = dispatch => ({
  onRemove: meetingId => dispatch(removeMeetingById(meetingId)),
  onEnter: meetingName => dispatch(push(`/${meetingName}`))
})

export default connect(mapStateToProps, mapDispatchToProps)(MeetingHistory)
