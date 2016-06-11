import React, {Component, PropTypes} from 'react'

class Audio extends Component {
  constructor() {
    super()
    this.handleRef = this.handleRef.bind(this)
  }

  shouldComponentUpdate(newProps) {
    return newProps.source !== this.props.source
  }

  componentWillUpdate(newProps) {
    if (newProps.source) {
      newProps.source.sink = this.audio
    } else if (this.audio) {
      this.audio.src = ''
    }
  }

  handleRef(ref) {
    this.audio = ref
    if (this.props.source) {
      this.props.source.sink = ref
    } else if (this.audio) {
      this.audio.src = ''
    }
  }

  render() {
    return (
      <audio className='Audio' ref={this.handleRef} muted={this.props.muted} autoPlay />
    )
  }
}

Audio.propTypes = {
  source: PropTypes.object,
  muted: PropTypes.bool,
}

export default Audio
