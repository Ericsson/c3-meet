
import {SET_CLIENT, UPDATE_OWN_USER, UPDATE_CLIENT_CONNECTION_STATE} from 'actions'

const initialState = {
  client: null,
  ownUser: null,
  connectionState: null,
}

export default function client(state = initialState, action) {
  switch (action.type) {
    case SET_CLIENT:
      let {client} = action
      return {...state, client}
    case UPDATE_OWN_USER:
      let {ownUser} = action
      return {...state, ownUser}
    case UPDATE_CLIENT_CONNECTION_STATE:
      let {connectionState} = action
      return {...state, connectionState}
    default:
      return state
  }
}
