// @flow
import React from 'react'
import Radium from 'radium'

import { dragStyle } from './ControlStyles'

/**
 * Renders a section on the titlebar that can be used to drag the window around
 */
const DragHandler = () => {
  return (
    <span style={[dragStyle]} />
  )
}

export default Radium(DragHandler)
