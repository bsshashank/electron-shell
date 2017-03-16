// @flow
import React from 'react'
import Radium from 'radium'
import Reflux from 'reflux'

class SettingsManager extends Reflux.Component {

  constructor (props, context) {
    super (props, context)
  }

  render () {
    return (
      <h2>Settings Manager</h2>
    )
  }
}

export default Radium(SettingsManager)
