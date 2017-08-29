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
import {devtools} from '@cct/libcct/devtools'
const {RelayTreeVisualization} = devtools

class ConferenceVisualization extends Component {
  constructor(props) {
    super(props)
    this._onSvgRef = this._onSvgRef.bind(this)
    this._onRelayLinksUpdate = this._onRelayLinksUpdate.bind(this)
  }

  _onSvgRef(svg) {
    if (svg) {
      this._visualization = new RelayTreeVisualization({width: 400, height: 400, svg})
      this._visualization.setRelayLinks(this.props.conference.switcher._relayLinks)
      this._visualization.start()
      this.props.conference.switcher.on('_relayLinks', this._onRelayLinksUpdate)
      window.visualization = this._visualization
    } else {
      this.props.conference.switcher.off('_relayLinks', this._onRelayLinksUpdate)
      this._visualization.setRelayLinks({ids: [], parents: []})
      window.visualization = null
    }
  }

  _onRelayLinksUpdate() {
    this._visualization.setRelayLinks(this.props.conference.switcher._relayLinks)
  }

  render() {
    return <svg className='relayTreeVisualization' ref={this._onSvgRef}/>
  }
}

ConferenceVisualization.propTypes = {
  conference: PropTypes.object.isRequired,
}

export default ConferenceVisualization
