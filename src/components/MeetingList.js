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

import MeetingListItem from 'components/MeetingListItem'

import styles from './MeetingList.css'

const MeetingList = ({meetings, className, onEnter, onRemove, ...props}) => {
  let meetingRows = meetings.map(itemProps => (
    <MeetingListItem
      key={itemProps.meetingId}
      {...itemProps}
      onEnter={onEnter}
      onRemove={onRemove}
    />
  ))

  if (meetingRows.length === 0) {
    return (
      <div className={classNames(styles.empty, className)} {...props}>
        {"You haven't joined any meetings yet"}
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

MeetingList.propTypes = {
  meetings: PropTypes.arrayOf(PropTypes.object).isRequired,
  onEnter: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,

  className: PropTypes.string,
}

export default MeetingList
