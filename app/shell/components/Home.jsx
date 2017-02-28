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

    this.state = {
      paneOpened: false
    }
  }

  handleTogglePane () {
    this.setState({ paneOpened: !this.state.paneOpened })
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

    let sidebarContent = (
        <div><SplitViewPaneToggle
          aria-controls={splitViewId}
          paneOpened={this.state.paneOpened}
          onInvoked={this.handleTogglePane.bind(this)} />
            <SplitView.Command
              label="Home"
              icon="home" />
            <SplitView.Command
              label="Settings"
              icon="settings" />
        </div>)

    let content = (
      <div>{this.props.children}</div>
    )

    return (
      <SplitView id={splitViewId} paneComponent={sidebarContent}
                 contentComponent={content} paneOpened={this.state.paneOpened} />
    )
  }
}

Home.contextTypes = {
  extensionManager: React.PropTypes.object.isRequired
}

export default Radium(Home)
