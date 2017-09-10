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

import {updateDisplayNameInput, submitDisplayName} from 'actions/client'

import Button from 'components/Button'
import Input from 'components/Input'

import styles from './DisplayNameInput.css'

class DisplayNameInput extends Component {
  constructor(props) {
    super(props)
    this.handleInput = this.handleInput.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleInput(event) {
    this.props.onUpdate(event.target.value)
  }

  handleSubmit(event) {
    event.preventDefault()
    this.props.onSubmit(this.props.displayName)
  }

  render() {
    let {className, displayName, ...props} = this.props
    delete props.onUpdate
    delete props.onSubmit
    return (
      <form className={classNames(styles.container, className)} onSubmit={this.handleSubmit} {...props}>
        <span className={styles.title}>
          Welcome to Ericsson C3 Meet
        </span>
        <Input
          className={styles.input}
          value={displayName}
          size={30}
          required
          placeholder='Display name'
          autoFocus={true}
          onChange={this.handleInput}
        />
        <Button className={styles.button} type='submit'>
          Continue
        </Button>
      </form>
    )
  }
}

DisplayNameInput.propTypes = {
  displayName: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  className: PropTypes.string,
}

const mapStateToProps = state => ({
  displayName: state.client.displayNameInput,
})

const mapDispatchToProps = dispatch => ({
  onUpdate: displayName => dispatch(updateDisplayNameInput(displayName)),
  onSubmit: displayName => dispatch(submitDisplayName(displayName)),
})

export default connect(mapStateToProps, mapDispatchToProps)(DisplayNameInput)
