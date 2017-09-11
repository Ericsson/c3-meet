
import {
  LOAD_MEETING_LIST,
  SORT_MEETING_LIST,
  REMOVE_MEETING_FROM_LIST,
  CREATE_MEETING_COMPLETE,
  JOIN_MEETING_COMPLETE,
} from 'actions/constants'

import {loadMeetingsList, sortMeetings, addMeeting, removeMeetingById} from 'modules/meetingStore'

const initialState = {
  meetings: [],
  orderBy: 'time',
  descending: true,
}

function loadMeetings(state) {
  let meetings = loadMeetingsList()
  let {orderBy, descending} = state
  sortMeetings({meetings, orderBy, descending})
  return meetings
}

export default function meetingHistory(state = initialState, action) {
  switch (action.type) {
    case LOAD_MEETING_LIST: {
      return {...state, meetings: loadMeetings(state)}
    }
    case SORT_MEETING_LIST: {
      let {orderBy, descending} = action
      let meetings = state.meetings.slice()
      sortMeetings({meetings, orderBy, descending})
      return {...state, orderBy, descending, meetings}
    }
    case REMOVE_MEETING_FROM_LIST: {
      let {meetingId} = action
      let updated = removeMeetingById(meetingId)
      if (updated) {
        return {...state, meetings: loadMeetings(state)}
      } else {
        return {...state}
      }
    }
    case CREATE_MEETING_COMPLETE: {
      addMeeting(action.meeting)
      return {...state, meetings: loadMeetings(state)}
    }
    case JOIN_MEETING_COMPLETE: {
      addMeeting(action.meeting)
      return {...state, meetings: loadMeetings(state)}
    }
    default:
      return state
  }
}
