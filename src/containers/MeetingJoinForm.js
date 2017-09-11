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
import classNames from 'classnames'
import {connect} from 'react-redux'

import {updateJoinMeetingNameInput, joinMeeting} from 'actions/meetingSetup'

import Button from 'components/Button'
import ErrorMessage from 'components/ErrorMessage'
import Input from 'components/Input'

import styles from './MeetingJoinForm.css'

class MeetingJoinForm extends Component {
  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    this.props.onUpdate(event.target.value)
  }

  handleSubmit(event) {
    event.preventDefault()
    this.props.onSubmit(this.props.meetingName)
  }

  render() {
    let {className, meetingName, joinError, ...props} = this.props
    delete props.onUpdate
    delete props.onSubmit
    return (
      <form className={classNames(styles.form, className)} onSubmit={this.handleSubmit} {...props}>
        <div className={styles.row}>
          <span className={styles.label}>Enter an existing meeting</span>
          {joinError && <ErrorMessage error={joinError} className={styles.error}/>}
        </div>
        <div className={styles.row}>
          <Input
            className={styles.input}
            type='text'
            value={meetingName}
            onChange={this.handleChange}
            placeholder='Meeting name'
            required
            maxLength={30}
            title='5-30 characters, only letters and numbers'
            pattern='[a-zA-Z0-9]{5,30}'
          />
          <Button type='submit' className={styles.button}>
            Join
          </Button>
        </div>
      </form>
    )
  }
}

MeetingJoinForm.propTypes = {
  meetingName: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  joinError: PropTypes.object,
}

const mapStateToProps = state => ({
  meetingName: state.meetingSetup.meetingJoinName,
  joinError: state.meetingSetup.joinError,
})

const mapDispatchToProps = dispatch => ({
  onUpdate: meetingName => dispatch(updateJoinMeetingNameInput(meetingName)),
  onSubmit: meetingName => dispatch(joinMeeting(meetingName)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MeetingJoinForm)
