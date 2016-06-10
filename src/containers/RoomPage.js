import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {startCCT} from '../actions'
import Video from '../components/Video'

class RoomPage extends Component {
  constructor (props) {
    super(props)
    let roomName = this.props.params.roomName
    this.props.dispatch(startCCT(roomName))
  }
  render () {
    const {switchSource, videoBroadcastSources} = this.props
    return (
      <div className="roomPage">
        <div className="mainVideoContainer">
          <Video source={switchSource}/>
        </div>
        <div className="thumbnailContainer">
          {videoBroadcastSources.map(({source, peer}) => (
            <Video key={peer} source={source}/>
          ))}
        </div>
      </div>
    )
  }
}

RoomPage.propTypes = {
  params: PropTypes.object,
  dispatch: PropTypes.func,
  switchSource: PropTypes.object,
  videoBroadcastSources: PropTypes.arrayOf(PropTypes.object),
}

const mapStateToProps = (state) => {
  const {switchSource, videoBroadcastSources} = state
  return {
    switchSource,
    videoBroadcastSources,
  }
}

export default connect(mapStateToProps)(RoomPage)
