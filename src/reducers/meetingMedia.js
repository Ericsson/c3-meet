
import {
  MEETING_SETUP_STARTED,
  MEETING_SETUP_COMPLETE,
  LEAVE_MEETING,
  ACQUIRE_MEETING_MEDIA_STARTED,
  ACQUIRE_MEETING_MEDIA_COMPLETE,
  ACQUIRE_MEETING_MEDIA_FAILED,
} from 'actions/constants'

const initialState = {
  conference: null,
  localSwitcherSource: null,
  remoteSwitcherSource: null,
  error: null,
  ready: false,
  waiting: false,
}

export default function meetingHistory(state = initialState, action) {
  switch (action.type) {
    case MEETING_SETUP_COMPLETE: {
      let {conference} = action
      let remoteSwitcherSource = conference.switcher

      let {localSwitcherSource} = state
      if (localSwitcherSource) {
        localSwitcherSource.connect(conference.switcher)
      }

      return {...state, conference, remoteSwitcherSource}
    }
    case LEAVE_MEETING: {
      return {...state, conference: null, remoteSwitcherSource: null}
    }
    case ACQUIRE_MEETING_MEDIA_STARTED: {
      let {localSwitcherSource} = state
      if (localSwitcherSource) {
        localSwitcherSource.stop()
      }
      return {...state, waiting: true, localSwitcherSource: null, ready: false}
    }
    case ACQUIRE_MEETING_MEDIA_COMPLETE: {
      let localSwitcherSource = action.source

      let {conference} = state
      if (conference) {
        localSwitcherSource.connect(conference.switcher)
      }

      return {...state, waiting: false, localSwitcherSource, ready: true}
    }
    case ACQUIRE_MEETING_MEDIA_FAILED: {
      let {error} = action
      return {...state, waiting: false, error}
    }
    default:
      return state
  }
}
