// @flow

import React from 'react'
import Radium from 'radium'

import AppTitle from './AppTitle'
import DragHandler from './DragHandler'
import MinimizeButton from './MinimizeButton'
import MaximizeButton from './MaximizeButton'
import CloseButton from './CloseButton'

/**
 * Renders the OS-specific titlebar on the MainWindow
 * @param {string} platform        the current OS we are running on
 * @param {string} title           the current title to be displayed on the MainWindow
 * @param {React.EventHandler} closeHandler    the function handling the close button click event
 * @param {React.EventHandler} minimizeHandler the function handling the minimize button click event
 * @param {React.EventHandler} maximizeHandler the function handling the maximize button click event
 */
const TitleBar = ({ platform, title, closeHandler, minimizeHandler, maximizeHandler }) => {

  let headerComponents = {}
  if (platform !== 'darwin') {
    headerComponents = (
      <div style={{height: '24px', flex: 1, alignContent: 'flex-end', alignItems: 'flex-end', justifyContent: 'flex-end', display: 'flex', padding: '2px', backgroundColor: '#f2f2f2'}}>
        <AppTitle title={title} />
        <DragHandler key='left' />
        <MinimizeButton platform={platform} clickHandler={minimizeHandler} />
        <MaximizeButton platform={platform} clickHandler={maximizeHandler} />
        <CloseButton platform={platform} clickHandler={closeHandler} />
      </div>
    )
  } else {
    headerComponents = (
      <div style={{height: '24px', flex: 1, alignContent: 'flex-start', alignItems: 'flex-start', justifyContent: 'flex-start', display: 'flex', padding: '2px', backgroundColor: '#f2f2f2'}}>
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

TitleBar.propTypes = {
  platform: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  closeHandler: React.PropTypes.func.isRequired,
  minimizeHandler: React.PropTypes.func.isRequired,
  maximizeHandler: React.PropTypes.func.isRequired
}

export default Radium(TitleBar)
