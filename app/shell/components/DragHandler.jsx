// @flow
import React from 'react'
import Radium from 'radium'

import { dragStyle } from './ControlStyles'

const DragHandler = (props) => {
  return (
    <span style={[dragStyle]} />
  )
}

export default Radium(DragHandler)
