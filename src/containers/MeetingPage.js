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

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {connect} from 'react-redux'

import * as icons from 'react-feather'

import ThumbnailContainer from 'components/ThumbnailContainer'
import Video from 'components/Video'

import Thumbnail from 'containers/Thumbnail'

import styles from './MeetingPage.css'

class MeetingPage extends Component {
  render() {
    let {className, mainVideo} = this.props
    let thumbnails = Array(20).fill().map((_, index) => (
      <Thumbnail key={index}>Thumbnail {index + 1}</Thumbnail>
    ))
    return (
      <div className={classNames(styles.page, className)}>
        <div className={styles.thumbnails}>
          <ThumbnailContainer>
            {thumbnails}
          </ThumbnailContainer>
        </div>
        <div className={styles.main}>
          <div className={styles.mainVideo}>
            <Video muted={true} source={mainVideo}/>
          </div>
          <div className={styles.controls}>
            <icons.Mic  className={styles.controlIcon}/>
            <icons.Video  className={styles.controlIcon}/>
            <icons.Monitor  className={styles.controlIcon}/>
            <icons.PhoneOff  className={styles.controlIcon}/>
          </div>
        </div>
      </div>
    )
  }
}

MeetingPage.propTypes = {
}

const mapStateToProps = state => ({
  mainVideo: state.meetingMedia.remoteSwitcherSource,
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(MeetingPage)
