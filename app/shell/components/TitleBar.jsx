// @flow

import React from 'react'
import Radium from 'radium'

import AppTitle from './AppTitle'
import DragHandler from './DragHandler'
import MinimizeButton from './MinimizeButton'
import MaximizeButton from './MaximizeButton'
import CloseButton from './CloseButton'

const TitleBar = (props) => {

  let headerComponents = {}
  if (props.platform !== 'darwin') {
    headerComponents = (
      <div style={{height: '24px', flex: 1, alignContent: 'flex-end', alignItems: 'flex-end', justifyContent: 'flex-end', display: 'flex', padding: '2px', backgroundColor: '#f2f2f2'}}>
        <AppTitle title={props.title} />
        <DragHandler key='left' />
        <MinimizeButton platform={props.platform} clickHandler={props.minimizeHandler} />
        <MaximizeButton platform={props.platform} clickHandler={props.maximizeHandler} />
        <CloseButton platform={props.platform} clickHandler={props.closeHandler} />
      </div>
    )
  } else {
    headerComponents = (
      <div style={{height: '24px', flex: 1, alignContent: 'flex-start', alignItems: 'flex-start', justifyContent: 'flex-start', display: 'flex', padding: '2px', backgroundColor: '#f2f2f2'}}>
        <CloseButton platform={props.platform} clickHandler={props.closeHandler} />
        <MinimizeButton platform={props.platform} clickHandler={props.minimizeHandler} />
        <MaximizeButton platform={props.platform} clickHandler={props.maximizeHandler} />
        <DragHandler key='left' />
        <AppTitle title={props.title} />
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
