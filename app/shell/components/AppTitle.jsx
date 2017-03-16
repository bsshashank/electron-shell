// @flow
import React from 'react'
import Radium from 'radium'

import { appTitleStyle } from '../styles/ControlStyles'

/**
 * Renders the application title to the MainWindow
 * @param {string} title the title to display on the MainWindow
 */
const AppTitle = ({ title }) => {
  return (
    <span style={[appTitleStyle]}>{title}</span>
  )
}

AppTitle.propTypes = {
  title: React.PropTypes.string.isRequired
}

export default Radium(AppTitle)
