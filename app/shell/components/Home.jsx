// @flow

import React from 'react'
import Radium from 'radium'

import { Link } from 'react-router'
import { SplitView, SplitViewPaneToggle } from 'react-winjs'

class Home extends React.Component {

  _extensionManager: Object

  constructor (props, context) {
    super (props, context)
    this._extensionManager = context.extensionManager
  }

  render () {
    let extensions = []

    /* extensions.push(
      <Link to={extension.path} key={extension.path}>
        <Icon name={extension.module.config.icon} style={{ paddingRight: '10px' }} />
        {extension.module.config.label}
      </Link>
    ) */
    var splitViewId = "mySplitView";

    let sidebarContent = (<div>
    <SplitViewPaneToggle
      aria-controls={splitViewId}
      paneOpened={this.state.paneOpened} />

    <SplitView.Command
      label="Home"
      icon="home"
      onInvoked={this.handleGoToHome} />
    <SplitView.Command
      label="Settings"
      icon="settings"
      onInvoked={this.handleGoToSettings} />
      </div>)

    return (
      <SplitView id={splitViewId} paneComponent={sidebarContent}
                 contentComponent={this.props.children} paneOpened={this.state.paneOpened}>
      </SplitView>
    )
  }
}

Home.contextTypes = {
  extensionManager: React.PropTypes.object.isRequired
}

export default Radium(Home)
