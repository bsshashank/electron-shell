// @flow
import React from 'react'
import Radium from 'radium'

import { UI } from 'electron-shell-helper'

class Home extends UI.ConnectedReactComponent {

  constructor (props, context) {
    super (props, context)
  }

  render () {
    return (
      <h2>Home</h2>
    )
  }
}

export default Radium(Home)
