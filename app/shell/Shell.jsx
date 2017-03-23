// @flow

import React from 'react'
import Radium from 'radium'

import { IntlProvider } from 'react-intl';
import { BrowserRouter } from 'react-router-dom';

import { Services, Storages } from 'electron-shell-services'
import { Components, Views } from 'electron-shell-ui'

const { ExtensionManager, SettingsManager } = Services
const { DocumentDatabase, FileStorage, SqlDatabase, TripleStore } = Storages
const { MainLayout } = Views

import { WindowStyle } from './styles/ControlStyles'
import TitleBar from './components/TitleBar'

import Reflux from 'reflux'
import ShellActions from './ShellActions'
import ShellStore from './ShellStore'

import type { ApplicationConfig,
              ISqlDatabase, IDocumentDatabase, ITripleStore, IFileStorage,
              IExtensionManager, ISettingsManager } from 'electron-shell'

class Shell extends Reflux.Component {

  config: ApplicationConfig
  sqlDB: ISqlDatabase
  docDB: IDocumentDatabase
  graphDB: ITripleStore
  fileStore: IFileStorage
  extensionManager: IExtensionManager
  settingsManager: ISettingsManager

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
    this.settingsManager = new SettingsManager(this.config, this.docDB)

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
    return (
      <div style={[WindowStyle]}>
        <TitleBar platform={this.config.platform} title={this.state.title}
                  closeHandler={this.closeApp.bind(this)} maximizeHandler={this.toggleFullScreen.bind(this)}
                  minimizeHandler={this.minimizeApp.bind(this)} />
        <IntlProvider locale={this.state.locale}>
          <BrowserRouter>
            <MainLayout />
          </BrowserRouter>
        </IntlProvider>
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
