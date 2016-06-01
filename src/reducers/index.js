import * as ActionTypes from '../actions'
import {routerReducer as routing} from 'react-router-redux'
import {combineReducers} from 'redux'

const navigationDrawerOpen = (open=false, action) => {
  if (action.type === ActionTypes.TOGGLE_NAVIGATION_DRAWER) {
    return !open
  } else {
    return open
  }
}

const rootReducer = combineReducers({
  navigationDrawerOpen,
  routing,
})

export default rootReducer
