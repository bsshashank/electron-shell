// @flow
import React from 'react'
import Radium from 'radium'
import Reflux from 'reflux'

import { Redirect } from 'react-router'

import type { ISettingsManager } from 'electron-shell'

class Home extends Reflux.Component {

  settingsManager: ISettingsManager

  constructor(props, context) {
    super(props, context)
  }

  render () {
    return (
      <h2>Home</h2>
    )
  }
}

Home.childContextTypes = {
  settingsManager: React.PropTypes.object.isRequired
}

export default Radium(Home)
