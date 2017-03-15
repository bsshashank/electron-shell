// @flow
import React from 'react'
import Radium from 'radium'

import { Link, Router, hashHistory } from 'react-router'

import DocumentDatabase from './services/DocumentDatabase'
import FileStorage from './services/FileStorage'
import SqlDatabase from './services/SqlDatabase'
import TripleStore from './services/TripleStore'

import ExtensionManager from './services/ExtensionManager'
import RouteHandler from './services/RouteHandler'

import TitleBar from './components/TitleBar'
import { WindowStyle } from './components/ControlStyles'

import Reflux from 'reflux'
import ShellActions from './ShellActions'
import ShellStore from './ShellStore'

import type { ApplicationConfig, ISqlDatabase, IDocumentDatabase, ITripleStore, IFileStorage, IExtensionManager, IRouteHandler } from 'electron-shell'

class Shell extends Reflux.Component {

  _appCfg: ApplicationConfig
  _sqlDB: ISqlDatabase
  _docDB: IDocumentDatabase
  _graphDB: ITripleStore
  _fileStore: IFileStorage
  _extensionManager: IExtensionManager
  _routeHandler: IRouteHandler
  store: ShellStore

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
    this._routeHandler = new RouteHandler(this._appCfg, this._extensionManager)

    this.store = new ShellStore(this._appCfg, this._docDB)
    this.store.initialize()
    .then(() => {
      ShellActions.mountActiveExtensions()
    })
    .catch((error) => {

    })
  }

  /**
   * getChildContext - description
   *
   * @return {type}  description
   */
  getChildContext() {
    return {
      appConfig: this._appCfg,
      documentDatabase: this._docDB,
      graphDatabase: this._graphDB,
      sqlDatabase: this._sqlDB
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
  documentDatabase: React.PropTypes.object.isRequired,
  graphDatabase: React.PropTypes.object.isRequired,
  sqlDatabase: React.PropTypes.object.isRequired
}

Shell.propTypes = {
  config: React.PropTypes.object.isRequired,
  closeHandler: React.PropTypes.func.isRequired,
  fullScreenHandler: React.PropTypes.func.isRequired,
  minimizeHandler: React.PropTypes.func.isRequired
}

export default Radium(Shell)
