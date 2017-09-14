/*
Copyright 2017 Ericsson AB.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import {MediaNode, HtmlSink} from '@cct/libcct'

const DEFAULT_CLEAR_CANVAS_TIMEOUT_MS = 2000

/**
 * A sink that can be used to take snapshots of a video stream that are
 * exported as either blobs or a data URIs.
 *
 * @class BurnInVideoSink
 */
export default class BurnInVideoSink extends MediaNode.connectMixin() {
  constructor(options = {}) {
    super()
    this._clearCanvas = this._clearCanvas.bind(this)
    this._render = this._render.bind(this)

    let {
      clearTimeoutMs = DEFAULT_CLEAR_CANVAS_TIMEOUT_MS,
    } = options

    this._canvas = null
    this._context = null
    this._videoTime = null
    this._frameRequest = null
    this._clearCanvasTimeoutId = null
    this._clearCanvasTimeoutMs = clearTimeoutMs

    this._video = document.createElement('video')
    this._htmlSink = new HtmlSink({target: this._video})

    this._render()
  }

  /**
   * The input from which the video will be captured.
   *
   * @member {MediaNodeInput} BurnInVideoSink#input
   */
  get input() {
    return this._htmlSink
  }

  set target(canvas) {
    this._canvas = canvas
    this._context = canvas ? canvas.getContext('2d') : null
  }

  stop() {
    if (this._frameRequest) {
      cancelAnimationFrame(this._frameRequest)
      this._frameRequest = null
    }
  }

  _render() {
    this._frameRequest = requestAnimationFrame(this._render)

    if (!this._context) {
      return
    }

    // It seems like the only valid check for whether the video is ready to render is .readyState === 4
    // Checking video.paused and video.networkState === HTMLVideoElement.NETWORK_NO_SOURCE works when
    // we want to hide video, but it is shown to early when the video returns, causing flickering.
    if (this._video.readyState !== HTMLVideoElement.HAVE_ENOUGH_DATA) {
      return
    }

    // video.currentTime is incremented only when new frames arrive
    if (this._videoTime !== this._video.currentTime) {
      this._videoTime = this._video.currentTime

      // This timeout clears the canvas if no frames are received in a while
      if (this._clearCanvasTimeoutId) {
        clearTimeout(this._clearCanvasTimeoutId)
        this._clearCanvasTimeoutId = null
      }
      this._clearCanvasTimeoutId = setTimeout(this._clearCanvas, this._clearCanvasTimeoutMs)

      let {videoWidth, videoHeight} = this._video
      this._canvas.width = videoWidth
      this._canvas.height = videoHeight
      this._context.drawImage(this._video, 0, 0, videoWidth, videoHeight)
    }
  }

  _clearCanvas() {
    if (this._context) {
      let {width, height} = this._canvas
      this._context.clearRect(0, 0, width, height)
    }
  }
}
