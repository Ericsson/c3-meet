import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'

class App extends Component {
  render () {
    const {children} = this.props
    return (
      <div>
        <h1>App Container</h1>
        <div>
          <Link to="/">Setup</Link>
          <Link to="/about">About</Link>
          <Link to="/room/123">Room</Link>
        </div>
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
