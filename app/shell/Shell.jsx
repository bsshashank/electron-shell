// @flow
import React from 'react'
import Radium from 'radium'
import { UI } from 'electron-shell-helper'

import { Link } from 'react-router'
import { toImmutable } from 'nuclear-js'

import DocumentDatabase from './services/DocumentDatabase'
import FileStorage from './services/FileStorage'
import SqlDatabase from './services/SqlDatabase'
import TripleStore from './services/TripleStore'

import ExtensionManager from './services/ExtensionManager'
import RouteHandler from './services/RouteHandler'

import Home from './components/Home'
import ShellActions from './actions/ShellActions'
import ShellStore from './store/ShellStore'

import { Router, hashHistory } from 'react-router'

import TitleBar from './components/TitleBar'
import { WindowStyle } from './components/ControlStyles'

/**
 *
 *
 * @class Shell
 * @extends {React.Component}
 */
class Shell extends UI.ConnectedReactComponent {

  _appCfg: Object
  _sqlDB: SqlDatabase
  _docDB: DocumentDatabase
  _graphDB: TripleStore
  _fileStore: FileStorage
  _extensionManager: ExtensionManager
  _routeHandler: RouteHandler
  _shellActions: ShellActions

  /**
   * Creates an instance of Shell.
   *
   */
  constructor (props, context) {
    super(props, context)

    this._appCfg = this.props.config
    this._sqlDB = new SqlDatabase(this._appCfg.app.name)
    this._docDB = new DocumentDatabase(this._appCfg.app.name)
    this._graphDB = new TripleStore(this._appCfg.app.name)
    this._fileStore = new FileStorage(this._appCfg)

    this._extensionManager = new ExtensionManager(this._appCfg, this._fileStore)
    this._routeHandler = new RouteHandler(this._appCfg, this._extensionManager, Home)

    this.state = {
      locale: this._appCfg.defaultLocale,
      title: `${this._appCfg.app.name} ${this._appCfg.app.version}`,
      activeModule: this._appCfg.app.name
    }

    this._reactor.registerStores({
      'app': ShellStore
    })

    // mount all available extensions
    this._shellActions = new ShellActions(this._reactor, this._docDB, this._extensionManager)
    this._shellActions.mountAvailableExtensions()
  }

  /**
   * getChildContext - description
   *
   * @return {type}  description
   */
  getChildContext() {
    return {
      appConfig: this._appCfg,
      reactor: this._reactor,
      documentDatabase: this._docDB,
      graphDatabase: this._graphDB,
      sqlDatabase: this._sqlDB,
      extensionManager: this._extensionManager,
      routeHandler: this._routeHandler
    }
  }

  getConnectedProperties () {
    return {
      extensions: ['app', 'extensions']
    }
  }

  /**
   * minimizeApp - description
   *
   * @return {type}  description
   */
  minimizeApp () {
    this.props.minimizeHandler()
  }

  /**
   * toggleFullScreen - description
   *
   * @return {type}  description
   */
  toggleFullScreen () {
   this.props.fullScreenHandler()
  }

  /**
   * closeApp - description
   *
   * @return {type}  description
   */
  closeApp () {
    this._docDB.save({ event: 'closed' }).then(() => {
     this.props.closeHandler()
    })
  }

  /**
   * render - description
   *
   * @return {type}  description
   */
  render () {
    let modules = []

    if (this.state.extensions) {
      this.state.extensions.toArray().map((item) => {
        const extension = item.toJS()
        console.log(extension)
        this._extensionManager.activateExtension(extension.location)
      })
    }


    return (
      <div style={[WindowStyle]}>
        <TitleBar platform={this._appCfg.platform} title={this.state.title}
                  closeHandler={this.closeApp.bind(this)} maximizeHandler={this.toggleFullScreen.bind(this)}
                  minimizeHandler={this.minimizeApp.bind(this)} />
        <Router history={hashHistory} routes={this._routeHandler.routes}></Router>
      </div>
    )
  }
}

Shell.childContextTypes = {
  appConfig: React.PropTypes.object.isRequired,
  reactor: React.PropTypes.object.isRequired,
  documentDatabase: React.PropTypes.object.isRequired,
  graphDatabase: React.PropTypes.object.isRequired,
  sqlDatabase: React.PropTypes.object.isRequired,
  extensionManager: React.PropTypes.object.isRequired,
  routeHandler: React.PropTypes.object.isRequired
}

Shell.propTypes = {
  config: React.PropTypes.object.isRequired,
  reactor: React.PropTypes.object.isRequired,
  closeHandler: React.PropTypes.func.isRequired,
  fullScreenHandler: React.PropTypes.func.isRequired,
  minimizeHandler: React.PropTypes.func.isRequired
}

export default Radium(Shell)
