
import {
  JOIN_MEETING_STARTED,
  JOIN_MEETING_COMPLETE,
  LEAVE_MEETING,
} from 'actions/constants'

const initialState = {
  room: null,
}

export default function meetingHistory(state = initialState, action) {
  switch (action.type) {
    case JOIN_MEETING_STARTED: {
      if (state.room) {
        state.room.leave()
      }
      return {...state, room: null}
    }
    case JOIN_MEETING_COMPLETE: {
      return {...state, room: action.meeting}
    }
    case LEAVE_MEETING: {
      return {...state, room: null}
    }
    default:
      return state
  }
}
