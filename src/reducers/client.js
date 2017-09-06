
import {
  SET_CLIENT,
  SET_STORED_DISPLAY_NAME,
  UPDATE_OWN_USER,
  UPDATE_DISPLAY_NAME,
  UPDATE_CLIENT_CONNECTION_STATE,
  AUTHENTICATE_CLIENT_STARTED,
  AUTHENTICATE_CLIENT_COMPLETE,
  AUTHENTICATE_CLIENT_FAILED,
  SET_DISPLAY_NAME_STARTED,
  SET_DISPLAY_NAME_COMPLETE,
  SET_DISPLAY_NAME_FAILED,
} from 'actions/constants'

const initialState = {
  client: null,
  ownUser: null,
  connectionState: null,
  displayName: null,
  storedDisplayName: null,

  authenticateClientInProgress: false,
  authenticateClientError: null,

  setDisplayNameInProgress: false,
  setDisplayNameError: null,
}

export default function client(state = initialState, action) {
  switch (action.type) {
    case SET_CLIENT: {
      let {client} = action
      return {...state, client}
    }
    case SET_STORED_DISPLAY_NAME: {
      let {storedDisplayName} = action
      return {...state, storedDisplayName}
    }
    case UPDATE_OWN_USER: {
      let {ownUser} = action
      return {...state, ownUser}
    }
    case UPDATE_DISPLAY_NAME: {
      let {displayName} = action
      return {...state, displayName}
    }
    case UPDATE_CLIENT_CONNECTION_STATE: {
      let {connectionState} = action
      return {...state, connectionState}
    }
    case AUTHENTICATE_CLIENT_STARTED: {
      return {...state, authenticateClientInProgress: true}
    }
    case AUTHENTICATE_CLIENT_COMPLETE: {
      return {...state, authenticateClientInProgress: false, authenticateClientError: null}
    }
    case AUTHENTICATE_CLIENT_FAILED: {
      let {error} = action
      return {...state, authenticateClientInProgress: false, authenticateClientError: error}
    }
    case SET_DISPLAY_NAME_STARTED: {
      return {...state, setDisplayNameInProgress: true}
    }
    case SET_DISPLAY_NAME_COMPLETE: {
      return {...state, setDisplayNameInProgress: false, setDisplayNameError: null}
    }
    case SET_DISPLAY_NAME_FAILED: {
      let {error} = action
      return {...state, setDisplayNameInProgress: false, setDisplayNameError: error}
    }
    default:
      return state
  }
}
