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
import GithubLogo from 'images/GitHub-Mark-Light-64px.png'

import styles from './GithubCorner.css'

const TITLE_DEFAULT = 'Fork me on GitHub'

const GithubCorner = ({url, title}) => (
  <a className={styles.container} href={url} target='_blank' title={title || TITLE_DEFAULT}>
    <img src={GithubLogo} className={styles.icon}/>
  </a>
)

GithubCorner.propTypes = {
  url: PropTypes.string.isRequired,
  title: PropTypes.string,
}

export default GithubCorner
