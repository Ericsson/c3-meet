import React, {Component} from 'react'
import {connect} from 'react-redux'

class SetupPage extends Component {
  render () {
    return (
      <div>
        <h1>Setup Page</h1>
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
