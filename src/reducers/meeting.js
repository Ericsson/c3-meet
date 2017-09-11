
import {
  JOIN_MEETING_STARTED,
  JOIN_MEETING_COMPLETE,
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
    case JOIN_MEETING_STARTED: {
      clearState(state)
      return initialState
    }
    case JOIN_MEETING_COMPLETE: {
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
