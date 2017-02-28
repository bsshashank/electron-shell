// @flow
import React from 'react'
import Radium from 'radium'

import { UI } from 'electron-shell-helper'

class SettingsManager extends UI.ConnectedReactComponent {

  constructor (props, context) {
    super (props, context)
  }

  render () {
    return (
      <div>Settings Manager</div>
    )
  }
}

export default Radium(SettingsManager)
