// @flow

import React from 'react'
import Radium from 'radium'

import AppTitle from './AppTitle'
import DragHandler from './DragHandler'
import MinimizeButton from './MinimizeButton'
import MaximizeButton from './MaximizeButton'
import CloseButton from './CloseButton'

class TitleBar extends React.Component {

  render () {
    let headerComponents = {}
    if (this.props.platform !== 'darwin') {
      headerComponents = (
        <div style={{height: '24px', flex: 1, alignContent: 'flex-end', alignItems: 'flex-end', justifyContent: 'flex-end', display: 'flex', padding: '2px', backgroundColor: '#f2f2f2'}}>
          <AppTitle title={this.props.title} />
          <DragHandler key='left' />
          <MinimizeButton platform={this.props.platform} clickHandler={this.props.minimizeHandler} />
          <MaximizeButton platform={this.props.platform} clickHandler={this.props.maximizeHandler} />
          <CloseButton platform={this.props.platform} clickHandler={this.props.closeHandler} />
        </div>
      )
    } else {
      headerComponents = (
        <div style={{height: '24px', flex: 1, alignContent: 'flex-start', alignItems: 'flex-start', justifyContent: 'flex-start', display: 'flex', padding: '2px', backgroundColor: '#f2f2f2'}}>
          <CloseButton platform={this.props.platform} clickHandler={this.props.closeHandler} />
          <MinimizeButton platform={this.props.platform} clickHandler={this.props.minimizeHandler} />
          <MaximizeButton platform={this.props.platform} clickHandler={this.props.maximizeHandler} />
          <DragHandler key='left' />
          <AppTitle title={this.props.title} />
          <DragHandler key='right' />
        </div>
      )
    }

    return headerComponents
  }
}

TitleBar.propTypes = {
  platform: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  closeHandler: React.PropTypes.func.isRequired,
  minimizeHandler: React.PropTypes.func.isRequired,
  maximizeHandler: React.PropTypes.func.isRequired
}

export default Radium(TitleBar)
