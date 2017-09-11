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

import {removeMeeting} from 'actions/meetingHistory'

import Button from 'components/Button'
import MeetingListItem from 'components/MeetingListItem'

import styles from './MeetingList.css'

class MeetingList extends Component {
  render() {
    let {meetings, className, onEnter, onRemove, ...props} = this.props

    let meetingRows = meetings.map(props => (
      <MeetingListItem
        key={props.meetingId}
        {...props}
        onEnter={onEnter}
        onRemove={onRemove}
        />
    ))

    if (meetingRows.length === 0) {
      return (
        <div className={classNames(styles.empty, className)} {...props}>
          You haven't joined any meetings yet
        </div>
      )
    }

    return (
      <div className={classNames(styles.list, className)} {...props}>
        <MeetingListItem.Header/>
        {meetingRows}
      </div>
    )
  }
}

MeetingList.propTypes = {
  meetings: PropTypes.arrayOf(PropTypes.object).isRequired,
  onEnter: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,

  className: PropTypes.string,
}

export default MeetingList