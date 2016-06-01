import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import Navigation from '../components/Navigation'
import {toggleNavigationDrawer} from '../actions'
import purpleBG from '../images/purple.png'

const backgroundStyle = {
  minHeight: '100vh',
  minWidth: '100vw',
  zIndex: -100,
  position: 'absolute',
  left: 0,
  top: 0,
}

class App extends Component {
  render () {
    const {children, drawerOpen, toggleDrawer} = this.props
    return (
      <div>
        <Navigation
          drawerOpen={drawerOpen}
          onDrawerToggle={toggleDrawer}/>
        <img src={purpleBG} style={backgroundStyle}/>
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
