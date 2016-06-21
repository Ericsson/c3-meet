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

import React, {PropTypes} from 'react'
import GithubLogo from '../images/GitHub-Mark-Light-64px.png'

const SIZE_DEFAULT = 60
const TITLE_DEFAULT = 'Fork me on GitHub'

const GithubCorner = ({url, title, size}) =>
  <a className="GithubCorner" href={url} target="_blank" title={title || TITLE_DEFAULT}>
    <img src={GithubLogo} width={size || SIZE_DEFAULT} height={size || SIZE_DEFAULT}/>
  </a>

GithubCorner.propTypes = {
  url: PropTypes.string.isRequired,
  title: PropTypes.string,
  size : PropTypes.number,
}

export default GithubCorner
