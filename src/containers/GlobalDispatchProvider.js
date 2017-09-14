
import {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import {registerGlobalDispatchers} from 'actions/globalDispatchers'

class GlobalDispatchProvider extends Component {
  componentWillMount() {
    this.props.register()
  }

  render() {
    return this.props.children
  }
}

GlobalDispatchProvider.propTypes = {
  children: PropTypes.element.isRequired,
  register: PropTypes.func.isRequired,
}

const mapDispatchToProps = dispatch => ({
  register: () => dispatch(registerGlobalDispatchers()),
})

export default connect(null, mapDispatchToProps)(GlobalDispatchProvider)

