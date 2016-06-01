import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

class RoomPage extends Component {
  render () {
    return (
      <div>
        <h1>Room Page</h1>
      </div>
    )
  }
}

RoomPage.propTypes = {
}

const mapStateToProps = (state) => {
  return state
}

export default connect(mapStateToProps)(RoomPage)
