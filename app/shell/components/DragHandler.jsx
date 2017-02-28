// @flow
import React from 'react'
import Radium from 'radium'

import { dragStyle } from './ControlStyles'

/**
 *
 */
class DragHandler extends React.Component {

  constructor (props) {
    super(props)
  }

  render () {
    return (
      <span style={[dragStyle]} />
    )
  }
}

export default Radium(DragHandler)
