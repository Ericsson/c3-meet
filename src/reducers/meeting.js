
import {
  MEETING_SETUP_COMPLETE,
  LEAVE_MEETING,
  CONFERENCE_CONNECTION_STATE,
  CONFERENCE_CONNECTION_ERROR,
} from 'actions/constants'

const initialState = {
  room: null,
  conference: null,
  connectionState: null,
  errors: [],
}

function clearState({room, conference, unsubscribe}) {
  if (room) {
    room.leave()
  }
  if (conference) {
    conference.close()
  }
  if (unsubscribe) {
    unsubscribe()
  }
}

export default function meetingHistory(state = initialState, action) {
  switch (action.type) {
    case MEETING_SETUP_COMPLETE: {
      let {room, conference, connectionState, unsubscribe} = action
      return {...state, room, conference, connectionState, unsubscribe}
    }
    case LEAVE_MEETING: {
      clearState(state)
      return initialState
    }
    case CONFERENCE_CONNECTION_STATE: {
      let {connectionState} = action
      return {...state, connectionState}
    }
    case CONFERENCE_CONNECTION_ERROR: {
      let {error} = action
      return {...state, errors: [...state.errors, error]}
    }
    default:
      return state
  }
}
