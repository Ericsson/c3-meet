import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

class App extends Component {
  render () {
    const {children} = this.props
    return (
      <div>
        {children}
      </div>
    )
  }
}

App.propTypes = {
  children: PropTypes.node,
}

const mapStateToProps = state => {
  return state
}

export default connect(mapStateToProps)(App)
