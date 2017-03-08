// @flow

import React from 'react'
import Radium from 'radium'

import { Link } from 'react-router'
import { SplitView, SplitViewPaneToggle } from 'react-winjs'

class MainLayout extends React.Component {

  constructor (props, context) {
    super (props, context)
    this.state = {
      paneOpened: false
    }
  }

  handleTogglePane () {
    this.setState({ paneOpened: !this.state.paneOpened })
  }

  navigateTo (route:string) {
    this.props.router.push(route)
  }

  getConnectedProperties () {
    return {
      extensions: ['app', 'routes']
    }
  }

  render () {
    let routes = []

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
              icon="home"
              onInvoked={this.navigateTo.bind(this, '/')}/>
            <SplitView.Command
              label="Settings"
              icon="settings"
              onInvoked={this.navigateTo.bind(this, 'settings')}/>
        </div>)

    let content = (
      <div>
        {this.props.children}
      </div>
    )

    return (
      <SplitView id={splitViewId} paneComponent={sidebarContent}
                 contentComponent={content} paneOpened={this.state.paneOpened}
                 closedDisplayMode="inline" openedDisplayMode="overlay"/>
    )
  }
}

export default Radium(MainLayout)
