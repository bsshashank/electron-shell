// @flow

import React from 'react'
import Radium from 'radium'

import AppTitle from './AppTitle'
import DragHandler from './DragHandler'
import MinimizeButton from './MinimizeButton'
import MaximizeButton from './MaximizeButton'
import CloseButton from './CloseButton'

import { TitleBarStyle } from '../styles/ControlStyles'

/**
 * Renders the OS-specific titlebar on the MainWindow
 * @param {string} platform        the current OS we are running on
 * @param {string} title           the current title to be displayed on the MainWindow
 * @param {EventHandler} closeHandler    the function handling the close button click event
 * @param {EventHandler} minimizeHandler the function handling the minimize button click event
 * @param {EventHandler} maximizeHandler the function handling the maximize button click event
 */
const TitleBar = ({ platform, title, closeHandler, minimizeHandler, maximizeHandler }: { platform: string, title: string, closeHandler: EventHandler, minimizeHandler: EventHandler, maximizeHandler: EventHandler}) => {

  let headerComponents = {}
  if (platform !== 'darwin') {
    headerComponents = (
      <div style={[TitleBarStyle]}>
        <AppTitle title={title} />
        <DragHandler key='left' />
        <MinimizeButton platform={platform} clickHandler={minimizeHandler} />
        <MaximizeButton platform={platform} clickHandler={maximizeHandler} />
        <CloseButton platform={platform} clickHandler={closeHandler} />
      </div>
    )
  } else {
    headerComponents = (
      <div style={[TitleBarStyle]}>
        <CloseButton platform={platform} clickHandler={closeHandler} />
        <MinimizeButton platform={platform} clickHandler={minimizeHandler} />
        <MaximizeButton platform={platform} clickHandler={maximizeHandler} />
        <DragHandler key='left' />
        <AppTitle title={title} />
        <DragHandler key='right' />
      </div>
    )
  }

  return headerComponents
}

export default Radium(TitleBar)
