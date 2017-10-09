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
import {devtools} from '@cct/libcct/devtools'
const {RelayTreeVisualization} = devtools

import styles from './ConferenceVisualization.css'

class ConferenceVisualization extends Component {
  constructor(props) {
    super(props)
    this._handleSvgRef = this._handleSvgRef.bind(this)
    this._handleRelayLinksUpdate = this._handleRelayLinksUpdate.bind(this)
  }

  _handleSvgRef(svg) {
    let {switcher} = this.props
    if (svg) {
      this._visualization = new RelayTreeVisualization({width: 400, height: 400, svg})
      this._visualization.setRelayLinks(switcher._relayLinks)
      this._visualization.start()
      switcher.on('_relayLinks', this._handleRelayLinksUpdate)
      window.visualization = this._visualization
    } else {
      switcher.off('_relayLinks', this._handleRelayLinksUpdate)
      this._visualization.setRelayLinks({ids: [], parents: []})
      window.visualization = null
    }
  }

  _handleRelayLinksUpdate() {
    this._visualization.setRelayLinks(this.props.switcher._relayLinks)
  }

  render() {
    let {className} = this.props
    return <svg className={classNames(styles.main, className)} ref={this._handleSvgRef}/>
  }
}

ConferenceVisualization.propTypes = {
  className: PropTypes.string,
  switcher: PropTypes.object.isRequired,
}

export default ConferenceVisualization
