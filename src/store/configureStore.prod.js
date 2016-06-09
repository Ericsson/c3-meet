import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'
import {routerMiddleware} from 'react-router-redux'
import {browserHistory} from 'react-router'

const configureStore = preloadedState => {
  return createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(thunk, routerMiddleware(browserHistory))
  )
}

export default configureStore
