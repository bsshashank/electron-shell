// @flow

import React from 'react'
import Radium from 'radium'

import { winButtonStyle, winIconStyle,
         osxButtonStyle, osxIconStyle } from '../styles/ControlStyles'

/**
 * Renders the OS-specific minimize button in the titlebar of the MainWindow
 * @param {string} platform     the current OS we are running on
 * @param {EventHandler} clickHandler the function handling the click event
 */
const MinimizeButton = ({ platform, clickHandler }: { platform: string, clickHandler: EventHandler }) => {

  var btnStyles = []
  var icon = {}

  if (platform !== 'darwin') {
    btnStyles = [winButtonStyle.base]
    icon = (
      <svg x='0px' y='0px' viewBox='0 0 10.2 1' style={[winIconStyle]}>
        <rect fill='#000000' width='10.2' height='1'></rect>
      </svg>
    )
  } else {
    btnStyles = [ osxButtonStyle.base, osxButtonStyle.minimize ]
    icon = (
      <svg x='0px' y='0px' viewBox='0 0 8 1.1' style={[osxIconStyle]}>
        <rect fill='#995700' width='8' height='1.1'></rect>
      </svg>
    )
  }

  return (
    <a key='minBtn' style={btnStyles} onClick={clickHandler}>
      {icon}
    </a>
  )
}

export default Radium(MinimizeButton)
