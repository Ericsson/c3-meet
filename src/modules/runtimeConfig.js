
// Replaced at runtime
const injectedConfig = 'C3_APP_RUNTIME_CONFIG'

class EnvReader {
  constructor(env) {
    this._env = env
  }

  get env() {
    return this._env
  }

  readString(name, {defaultValue = null} = {}) {
    return this._env[name] || defaultValue
  }

  readJson(name, {defaultValue = undefined} = {}) {
    let value = this._env[name]
    if (!value) {
      return defaultValue
    }
    try {
      return JSON.parse(value)
    } catch (error) {
      throw new Error(`Invalid config, failed to parse json for ${name}, ${error}`)
    }
  }

  // Truthy: Yes, ye, yep, YES, yes, true, True, TRUE, 1, 2, asdfg
  // Falsy: No, no, nope, false, False, 0, '' (as null)
  readBool(name, {defaultValue = false} = {}) {
    let value = this._env[name]
    if (!value) {
      return defaultValue
    } else if (typeof(value) !== 'string') {
      return !!value
    } else if (['y', 't'].indexOf(value[0].toLowerCase()) !== -1) {
      return true
    } else if (['n', 'f'].indexOf(value[0].toLowerCase()) !== -1) {
      return false
    } else if (value === '0') {
      return false
    } else {
      return !!value
    }
  }

  readNumber(name, {defaultValue = -1, base = 10} = {}) {
    let value = this._env[name]
    if (!value) {
      return defaultValue
    }
    let number = parseInt(value, base)
    if (isNaN(number)) {
      throw new Error(`Invalid config, failed to parse number for ${name}, got ${value}`)
    }
    return number
  }

  readTurnServerUri(name, {defaultValue = null} = {}) {
    let value = this._env[name] || defaultValue
    if (!value) {
      return value
    }
    let match = value.match(/^(.+):(.+)@(.+)$/)
    if (match) {
      let [_, username, credential, host] = match
      return [{
        username,
        credential,
        urls: `turn:${host}?transport=tcp`,
      }, {
        username,
        credential,
        urls: `turn:${host}?transport=udp`,
      }]
    } else {
      throw new Error('Invalid ice server config, it should have the format user:pass@host')
    }
  }
}

export function getRuntimeConfig() {
  var reader
  if (injectedConfig[0] !== '{') { // No config injected
    if (process.env.RUNTIME_CONFIG) {
      // This is injected in webpack.config.js with DefinePlugin for dev builds
      return new EnvReader(process.env.RUNTIME_CONFIG)
    } else {
      return new EnvReader({})
    }
  } else {
    try {
      let parsed = JSON.parse(injectedConfig)
      return new EnvReader(parsed)
    } catch (error) {
      throw new Error(`Failed to parse runtime configuration, ${error}`)
    }
  }
}


