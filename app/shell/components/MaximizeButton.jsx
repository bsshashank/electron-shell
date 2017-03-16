// @flow
import React from 'react'
import Radium from 'radium'

import { winButtonStyle, winIconStyle,
         osxButtonStyle, osxIconStyle } from '../styles/ControlStyles'

/**
 * Renders the os-specific maximize button in the titlebar of the MainWindow
 * @param {string} platform     the current OS we are running on
 * @param {React.EventHandler} clickHandler the function handling the click event
 */
const MaximizeButton = ({ platform, clickHandler }) => {

  var btnStyles = []
  var icon = {}

  if (platform !== 'darwin') {
    btnStyles = [winButtonStyle.base]
    icon = (
      <svg x='0px' y='0px' viewBox='0 0 10.2 10.2' style={[winIconStyle]}>
        <path fill='#000000' d='M2.1,0v2H0v8.1h8.2v-2h2V0H2.1z M7.2,9.2H1.1V3h6.1V9.2z M9.2,7.1h-1V2H3.1V1h6.1V7.1z'></path>
      </svg>
    )
  } else {
    btnStyles = [ osxButtonStyle.base, osxButtonStyle.maximize ]
    icon = (
      <svg x='0px' y='0px' viewBox='0 0 6 5.9' style={[osxIconStyle]}>
        <path fill='#006400' d='M5.4,0h-4L6,4.5V0.6C5.7,0.6,5.3,0.3,5.4,0z'></path>
        <path fill='#006400' d='M0.6,5.9h4L0,1.4l0,3.9C0.3,5.3,0.6,5.6,0.6,5.9z'></path>
      </svg>
    )
  }

  return (
    <a key='maxBtn' style={btnStyles} onClick={clickHandler}>
      {icon}
    </a>
  )
}

MaximizeButton.propTypes = {
  clickHandler: React.PropTypes.func.isRequired,
  platform: React.PropTypes.string.isRequired
}

export default Radium(MaximizeButton)
