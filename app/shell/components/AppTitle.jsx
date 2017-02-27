// @flow
import React from 'react'
import Radium from 'radium'

const appTitleStyle = {
  WebkitUserSelect: 'none',
  cursor: 'default',
  fontFamily: 'Segoe UI',
  fontSize: '12px',
  paddingLeft: '10px',
  paddingBottom: '5px'
}

/**
 *  A React component to render application titles
 *
 * @class AppTitle
 * @extends {React.Component}
 */
class AppTitle extends React.Component {

  /**
   *  renders the application title
   *
   * @returns a span with the application title
   */
  render () {
    return (
      <span style={[appTitleStyle]}>{this.props.title}</span>
    )
  }
}

AppTitle.propTypes = {
  title: React.PropTypes.string.isRequired
}

export default Radium(AppTitle)
