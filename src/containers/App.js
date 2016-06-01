import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import Navigation from '../components/Navigation'
import {toggleNavigationDrawer} from '../actions'

class App extends Component {
  render () {
    const {children, drawerOpen, toggleDrawer} = this.props
    return (
      <div>
        <Navigation
          drawerOpen={drawerOpen}
          onDrawerToggle={toggleDrawer}/>
        {children}
      </div>
    )
  }
}

App.propTypes = {
  children: PropTypes.node,
  drawerOpen: PropTypes.bool,
  toggleDrawer: PropTypes.func.isRequired,
}

const mapStateToProps = state => {
  const {navigationDrawerOpen} = state
  return {
    drawerOpen: navigationDrawerOpen,
  }
}

export default connect(mapStateToProps, {
  toggleDrawer: toggleNavigationDrawer,
})(App)
