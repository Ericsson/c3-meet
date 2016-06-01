import React, {PropTypes} from 'react'
import {Provider} from 'react-redux'
import routes from '../routes'
import {Router} from 'react-router'

import DevTools from './DevTools'

const Root = ({store, history}) => (
  <Provider store={store}>
    <div>
      <Router history={history} routes={routes}/>
      <DevTools/>
    </div>
  </Provider>
)

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
}

export default Root
