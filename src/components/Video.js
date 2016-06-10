import React, {Component, PropTypes} from 'react'

class Video extends Component {
  constructor() {
    super()
    this.handleRef = this.handleRef.bind(this)
    this.handleVideoUpdate = this.handleVideoUpdate.bind(this)
  }

  handleVideoUpdate() {
    let width = 0
    let height = 0
    let aspectRatio = 0

    if (this.video) {
      width = this.video.videoWidth
      height = this.video.videoHeight

      if (width) {
        aspectRatio = width / height
      }
    }

    this.props.onResize({width, height, aspectRatio})
  }

  shouldComponentUpdate(newProps) {
    return newProps.source !== this.props.source
  }

  componentWillUpdate(newProps) {
    if (newProps.source) {
      newProps.source.sink = this.video
    } else if (this.video) {
      // TODO add support for this in libcct
      this.video.src = ''
    }
  }

  handleRef(ref) {
    this.video = ref
    if (this.props.source) {
      this.props.source.sink = ref
    } else if (this.video) {
      this.video.src = ''
    }
    if (this.props.onResize) {
      if (ref) {
        ref.addEventListener('loadedmetadata', this.handleVideoUpdate)
        ref.addEventListener('emptied', this.handleVideoUpdate)
      }
      this.handleVideoUpdate()
    }
  }

  render() {
    return (
      <video className='Video' ref={this.handleRef} muted={this.props.muted} autoPlay />
    )
  }
}

Video.propTypes = {
  source: PropTypes.object,
  onResize: PropTypes.func,
  muted: PropTypes.bool,
}

export default Video
