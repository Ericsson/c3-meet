
import {
  MEETING_SETUP_STARTED,
  MEETING_SETUP_COMPLETE,
  LEAVE_MEETING,
} from 'actions/constants'

const initialState = {
  room: null,
  conference: null,
}

function clearState({room, conference}) {
  if (room) {
    room.leave()
  }
  if (conference) {
    conference.close()
  }
}

export default function meetingHistory(state = initialState, action) {
  switch (action.type) {
    case MEETING_SETUP_STARTED: {
      clearState(state)
      return initialState
    }
    case MEETING_SETUP_COMPLETE: {
      let {room, conference} = action
      return {...state, room, conference}
    }
    case LEAVE_MEETING: {
      clearState(state)
      return initialState
    }
    default:
      return state
  }
}
