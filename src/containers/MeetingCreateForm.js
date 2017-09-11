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

import {generateCreateMeetingName, updateCreateMeetingNameInput, createMeeting} from 'actions/meetingSetup'

import Button from 'components/Button'
import ErrorMessage from 'components/ErrorMessage'
import Input from 'components/Input'

import styles from './MeetingCreateForm.css'

class MeetingCreateForm extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleUrlClick = this.handleUrlClick.bind(this)
  }

  componentWillMount() {
    this.props.generateName()
  }

  handleChange(event) {
    this.props.onUpdate(event.target.value)
  }

  handleSubmit(event) {
    event.preventDefault()
    this.props.onSubmit(this.props.meetingName)
  }

  handleUrlClick({target}) {
    if (!document.createRange || !window.getSelection) {
      return
    }
    let range = document.createRange()
    range.setStart(target, 0)
    range.setEnd(target.nextElementSibling, 0)

    let selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)
  }

  render() {
    let {className, meetingName, joinError, ...props} = this.props
    delete props.onUpdate
    delete props.onSubmit
    delete props.generateName
    return (
      <form className={classNames(styles.form, className)} onSubmit={this.handleSubmit} {...props}>
        <span className={styles.label}>Create a named conference meeting</span>
        <div className={styles.inputRow}>
          <span className={styles.meetingUrl}>meet.c3.ericsson.net/</span>
          <Input
            className={styles.input}
            type='text'
            value={meetingName}
            autoFocus={true}
            placeholder='Meeting name'
            required
            maxLength={30}
            title='5-30 characters, only letters and numbers'
            pattern='[a-zA-Z0-9]{5,30}'
            onChange={this.handleChange}
          />
        </div>
        <Button type='submit' className={styles.button}>
          Create
        </Button>
        {joinError && <ErrorMessage error={joinError} className={styles.error}/>}
      </form>
    )
  }
}

MeetingCreateForm.propTypes = {
  generateName: PropTypes.func.isRequired,
  meetingName: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  joinError: PropTypes.object,
}

const mapStateToProps = state => ({
  meetingName: state.meetingSetup.meetingCreateName,
  joinError: state.meetingSetup.joinError,
})

const mapDispatchToProps = dispatch => ({
  generateName: meetingName => dispatch(generateCreateMeetingName(meetingName)),
  onUpdate: meetingName => dispatch(updateCreateMeetingNameInput(meetingName)),
  onSubmit: meetingName => dispatch(createMeeting(meetingName)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MeetingCreateForm)
