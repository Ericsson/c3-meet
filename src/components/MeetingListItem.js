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
import {Link} from 'react-router-dom'
import {X} from 'react-feather'

import {formatRelative} from 'modules/intl'

import styles from './MeetingListItem.css'

const MeetingListItem = ({meetingId, meetingName, meetingTime, onRemove, className, ...props}) => (
  <div className={classNames(styles.row, styles.item, className)} {...props}>
    <span className={styles.name}>
      <Link className={styles.link} to={`/${meetingName}`}>{meetingName}</Link>
    </span>
    <span className={styles.time}>{formatRelative(meetingTime)}</span>
    <span className={styles.remove} onClick={() => onRemove(meetingId)}><X/></span>
  </div>
)

MeetingListItem.propTypes = {
  meetingId: PropTypes.string.isRequired,
  meetingName: PropTypes.string.isRequired,
  meetingTime: PropTypes.instanceOf(Date).isRequired,
  onRemove: PropTypes.func.isRequired,
  className: PropTypes.string,
}

const MeetingListHeader = ({className, ...props}) => (
  <div className={classNames(styles.row, styles.header, className)} {...props}>
    <span className={styles.name}>Name</span>
    <span className={styles.time}>Time</span>
    <span className={styles.remove}/>
  </div>
)

MeetingListHeader.propTypes = {
  className: PropTypes.string,
}

MeetingListItem.Header = MeetingListHeader

export default MeetingListItem
