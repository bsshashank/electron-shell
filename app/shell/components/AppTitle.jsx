// @flow

import React from 'react'
import Radium from 'radium'

import { appTitleStyle } from '../styles/ControlStyles'

/**
 * Renders the application title to the MainWindow
 * @param {string} title the title to display on the MainWindow
 */
const AppTitle = ({ title }: { title: string }) => {
  return (
    <span style={[appTitleStyle]}>{title}</span>
  )
}

export default Radium(AppTitle)
