
import {
  SET_MEETING_LIST,
  SORT_MEETING_LIST,
} from 'actions/constants'

import {sortMeetings} from 'modules/meetingStore'

const initialState = {
  meetings: [],
  orderBy: 'time',
  descending: true,
}

export default function meetingHistory(state = initialState, action) {
  switch (action.type) {
    case SET_MEETING_LIST: {
      let meetings = action.meetings.slice()
      let {orderBy, descending} = state
      sortMeetings({meetings, orderBy, descending})
      return {...state, meetings}
    }
    case SORT_MEETING_LIST: {
      let {orderBy, descending} = action
      let meetings = state.meetings.slice()
      sortMeetings({meetings, orderBy, descending})
      return {...state, orderBy, descending, meetings}
    }
    default:
      return state
  }
}
