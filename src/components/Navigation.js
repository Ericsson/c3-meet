import React, {PropTypes} from 'react'
import {AppBar, Drawer, MenuItem} from 'material-ui'
import {Link} from 'react-router'

const Navigation = ({drawerOpen, onDrawerToggle}) => (
  <div>
    <AppBar
      title="C3 Meet"
      onLeftIconButtonTouchTap={onDrawerToggle}
      style={{backgroundColor: 'rgba(0, 0, 0, 0.51)'}}/>
    <Drawer
      open={drawerOpen}
      docked={false}
      onRequestChange={onDrawerToggle}>
      <Link to="/" style={{}}>
        <MenuItem primaryText="Start"/>
      </Link>
      <Link to="/about" style={{}}>
        <MenuItem primaryText="About"/>
      </Link>
    </Drawer>
  </div>
)

Navigation.propTypes = {
  drawerOpen: PropTypes.bool,
  onDrawerToggle: PropTypes.func,
}

export default Navigation
