import React, {Component} from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'
import Jumbotron from '../components/Jumbotron'
import RoomInput from '../components/RoomInput'

class SetupPage extends Component {
  joinRoom (room) {
    this.props.dispatch(push(`/room/${room}`))
  }
  render () {
    return (
      <div>
        <Jumbotron
          header="C3 Meet"
          subheader="Conferencing made simple"
        >
          <RoomInput onSubmit={room => this.joinRoom(room)}/>
        </Jumbotron>
      </div>
    )
  }
}

SetupPage.propTypes = {
}

const mapStateToProps = (state) => {
  return state
}

export default connect(mapStateToProps)(SetupPage)
