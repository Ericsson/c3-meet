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
