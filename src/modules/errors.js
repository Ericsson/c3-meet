
// Need to do some trickery here to allow subclassing later on
export function CustomError(message, extra = undefined) {
  if (!message || typeof(message) !== 'string') {
    throw new TypeError("new CustomError(message): 'message' must be a string")
  }
  this.message = message
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor)
  } else {
    this.stack = new Error(message).stack
  }
  this.extra = extra
}

Object.setPrototypeOf(CustomError, Error)
CustomError.prototype = Object.create(Error.prototype, {
  name: {
    get() {
      return this.constructor.name
    },
  },
  displayMessage: {
    get() {
      return this.constructor.displayMessage || UnknownError.displayMessage
    },
  },
})

CustomError.prototype.constructor = CustomError
CustomError.prototype.toJSON = function () {
  return {
    message: this.message,
    name: this.name,
    extra: this.extra,
  }
}

export class UnknownError extends CustomError {}
UnknownError.displayMessage = 'An unknown error occured'

export class AnonymousAuthError extends CustomError {}
AnonymousAuthError.displayMessage = 'Server does not allow anonymous access'

export class AuthRequestError extends CustomError {}
AuthRequestError.displayMessage = 'Failed to connect to login server, please try again'

// Authentication was successful but the response was invalid
export class AuthResponseError extends CustomError {}
AuthResponseError.displayMessage = 'Failed to create meeting session, please try again'

export class NameRequestError extends CustomError {}
NameRequestError.displayMessage = 'Failed to set display name'

// There was an error entering the meeting, likely due to illegal state
export class EnterMeetingError extends CustomError {}
EnterMeetingError.displayMessage = 'Failed to enter meeting'

export class MeetingNotFoundError extends CustomError {}
MeetingNotFoundError.displayMessage = 'Meeting does not exist'

export class MeetingNameConflictError extends CustomError {}
MeetingNameConflictError.displayMessage = 'A meeting with that name already exists'

export class InvalidMeetingNameError extends CustomError {}
InvalidMeetingNameError.displayMessage = 'Meeting name contains invalid characters'

export class ForbiddenMeetingError extends CustomError {}
ForbiddenMeetingError.displayMessage = 'You are not allowed to join that meeting'

export class SessionLostError extends CustomError {}
SessionLostError.displayMessage = 'Login session has timed out'

export class UserMediaError extends CustomError {
  static fromError(error) {
    if (error.name === 'NotAllowedError') {
      return new NotAllowedUserMediaError('user media access not allowed')
    } else if (error.name === 'NotFoundError') {
      return new NotFoundUserMediaError('user media access not allowed')
    } else if (error.name === 'OverconstrainedError') {
      let constraint = error.reason.constraint || error.reason.constraintName
      return new ConstraintUserMediaError(constraint)
    } else {
      return new UserMediaError(`unknown user media error, ${error}`)
    }
  }
}
UserMediaError.displayMessage = 'Failed to access microphone or webcam'

class NotAllowedUserMediaError extends UserMediaError {}
NotAllowedUserMediaError.displayMessage = 'Please allow access to your media devices and try again.'

class NotFoundUserMediaError extends UserMediaError {}
NotFoundUserMediaError.displayMessage = 'Could not find the requested media devices, ' +
  'please make sure they are connected and try again.'

class ConstraintUserMediaError extends UserMediaError {
  constructor(constraint) {
    super(`User media could not satify constraint ${constraint}`, {constraint})
  }
}
ConstraintUserMediaError.displayMessage = "Media device access failed because the desired '{constraint}' was rejected."

export class NoSoundDetectedError extends CustomError {}
NoSoundDetectedError.displayMessage = 'No sound detected'
