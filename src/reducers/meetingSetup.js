
import {
  UPDATE_CREATE_MEETING_NAME_INPUT,
  CREATE_MEETING_STARTED,
  CREATE_MEETING_COMPLETE,
  CREATE_MEETING_FAILED,
  UPDATE_JOIN_MEETING_NAME_INPUT,
  JOIN_MEETING_STARTED,
  JOIN_MEETING_COMPLETE,
  JOIN_MEETING_FAILED,
} from 'actions/constants'

const initialState = {
  meetingCreateName: '',
  meetingJoinName: '',

  joinInProgress: false,
  joinError: null,
}

export default function meetingHistory(state = initialState, action) {
  switch (action.type) {
    case UPDATE_CREATE_MEETING_NAME_INPUT: {
      let {meetingName} = action
      return {...state, meetingCreateName: meetingName}
    }
    case UPDATE_JOIN_MEETING_NAME_INPUT: {
      let {meetingName} = action
      return {...state, meetingJoinName: meetingName}
    }
    case JOIN_MEETING_STARTED: {
      return {
        ...state,
        joinInProgress: true,
        joinError: null,
        meetingCreateName: '',
        meetingJoinName: '',
      }
    }
    case JOIN_MEETING_COMPLETE: {
      return {...state, joinInProgress: false, joinError: null}
    }
    case JOIN_MEETING_FAILED: {
      let {error} = action
      return {...state, joinInProgress: false, joinError: error}
    }
    default:
      return state
  }
}
