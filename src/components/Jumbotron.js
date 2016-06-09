import React, {PropTypes} from 'react'

const Jumbotron = ({header, subheader, children}) => (
  <div className="jumbotron">
    <h1>{header}</h1>
    <h2>{subheader}</h2>
    {children}
  </div>
)

Jumbotron.propTypes = {
  header: PropTypes.string.isRequired,
  subheader: PropTypes.string.isRequired,
  children: PropTypes.node,
}

export default Jumbotron
