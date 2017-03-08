// @flow
import React from 'react'
import Radium from 'radium'

import { appTitleStyle } from './ControlStyles'

const AppTitle = (props) => {
  return (
    <span style={[appTitleStyle]}>{props.title}</span>
  )
}

AppTitle.propTypes = {
  title: React.PropTypes.string.isRequired
}

export default Radium(AppTitle)
