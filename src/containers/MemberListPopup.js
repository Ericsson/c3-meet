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

import {Users} from 'react-feather'

import styles from './MemberListPopup.css'

const MemberListPopup = ({className, onlineMembers}) => {
  return (
    <div className={styles.container}>
      <Users className={classNames(styles.button, className)}/>
      <div className={styles.popup}>
        {Object.keys(onlineMembers).map(userId => (
          <span key={userId} className={styles.popupText}>
            {onlineMembers[userId].name} ({userId})
          </span>
        ))}
      </div>
    </div>
  )
}

MemberListPopup.propTypes = {
}

const mapStateToProps = state => ({
  onlineMembers: state.meetingPeers.onlineMembers,
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(MemberListPopup)
