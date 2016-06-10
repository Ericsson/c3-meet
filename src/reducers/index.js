import * as ActionTypes from '../actions'
import {routerReducer as routing} from 'react-router-redux'
import {combineReducers} from 'redux'

const switchSource = (state=null, action) => {
  if (action.type === ActionTypes.MEDIA_SWITCHER) {
    return action.switcher
  } else {
    return state
  }
}

const videoBroadcastSources = (state=[], action) => {
  if (action.type === ActionTypes.ADD_VIDEO_BROADCASTER) {
    let {source, peer} = action
    return state.filter(({peer: p}) => p !== peer).concat({
      source,
      peer,
    })
  } else {
    return state
  }
}

const rootReducer = combineReducers({
  switchSource,
  videoBroadcastSources,
  routing,
})

export default rootReducer
