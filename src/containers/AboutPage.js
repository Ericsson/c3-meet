import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

class AboutPage extends Component {
  render () {
    return (
      <div>
        <h1>About Page</h1>
      </div>
    )
  }
}

AboutPage.propTypes = {
}

const mapStateToProps = (state) => {
  return state
}

export default connect(mapStateToProps)(AboutPage)
