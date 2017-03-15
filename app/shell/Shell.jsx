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

  config: ApplicationConfig
  sqlDB: ISqlDatabase
  docDB: IDocumentDatabase
  graphDB: ITripleStore
  fileStore: IFileStorage
  extensionManager: IExtensionManager
  routeHandler: IRouteHandler

  /**
   * Creates an instance of Shell.
   *
   */
  constructor (props, context) {
    super(props, context)

    this.config = this.props.config
    this.sqlDB = new SqlDatabase(this.config.app.name)
    this.docDB = new DocumentDatabase(this.config.app.name)
    this.graphDB = new TripleStore(this.config.app.name)
    this.fileStore = new FileStorage(this.config)

    this.extensionManager = new ExtensionManager(this.config, this.fileStore)
    this.routeHandler = new RouteHandler(this.config, this.extensionManager)

    this.store = new ShellStore(this.config, this.docDB)
    this.store.initialize().then(() => {
      ShellActions.mountActiveExtensions()
    }).catch((error) => {

    })
  }

  /**
   * getChildContext - description
   *
   * @return {type}  description
   */
  getChildContext() {
    return {
      appConfig: this.config,
      documentDatabase: this.docDB,
      graphDatabase: this.graphDB,
      sqlDatabase: this.sqlDB,
      fileStorage: this.fileStore
    }
  }

  /**
   * minimizeApp - description
   *
   * @return {type}  description
   */
  minimizeApp () : void {
    this.props.minimizeHandler()
  }

  /**
   * toggleFullScreen - description
   *
   * @return {type}  description
   */
  toggleFullScreen () : void {
   this.props.fullScreenHandler()
  }

  /**
   * closeApp - description
   *
   * @return {type}  description
   */
  closeApp () : void {
    this.docDB.save({ event: 'closed' }).then(() => {
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
    console.log(this.props, this.state)
    return (
      <div style={[WindowStyle]}>
        <TitleBar platform={this.config.platform} title={this.state.title}
                  closeHandler={this.closeApp.bind(this)} maximizeHandler={this.toggleFullScreen.bind(this)}
                  minimizeHandler={this.minimizeApp.bind(this)} />
        <Router history={hashHistory} routes={this.routeHandler.routes}></Router>
      </div>
    )
  }
}

Shell.childContextTypes = {
  appConfig: React.PropTypes.object.isRequired,
  documentDatabase: React.PropTypes.object.isRequired,
  graphDatabase: React.PropTypes.object.isRequired,
  sqlDatabase: React.PropTypes.object.isRequired,
  fileStorage: React.PropTypes.object.isRequired
}

Shell.propTypes = {
  config: React.PropTypes.object.isRequired,
  closeHandler: React.PropTypes.func.isRequired,
  fullScreenHandler: React.PropTypes.func.isRequired,
  minimizeHandler: React.PropTypes.func.isRequired
}

export default Radium(Shell)
