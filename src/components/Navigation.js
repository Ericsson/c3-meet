import React, {PropTypes} from 'react'
import {AppBar, Drawer, MenuItem} from 'material-ui'

const Navigation = ({drawerOpen, onDrawerToggle}) => (
  <div>
    <AppBar
      title="C3 Meet"
      onLeftIconButtonTouchTap={onDrawerToggle} />
    <Drawer
      open={drawerOpen}
      docked={false}
      onRequestChange={onDrawerToggle}>
      <MenuItem>Hello</MenuItem>
    </Drawer>
  </div>
)

Navigation.propTypes = {
  drawerOpen: PropTypes.bool,
  onDrawerToggle: PropTypes.func,
}

export default Navigation
