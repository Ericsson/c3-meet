
import {
  SET_MEETING_LIST,
  SORT_MEETING_LIST,
} from 'actions/constants'

import {sortMeetings} from 'modules/meetingStore'

const initialState = {
  meetings: [],
}

export default function meetingHistory(state = initialState, action) {
  switch (action.type) {
    case SET_MEETING_LIST: {
      let {meetings} = action
      return {...state, meetings}
    }
    case SORT_MEETING_LIST: {
      let {orderBy, descending} = action
      let meetings = state.meetings.slice()
      let sortedMeetings = sortMeetings({meetings, orderBy, descending})
      return {...state, meetings: sortMeetings}
    }
    default:
      return state
  }
}
