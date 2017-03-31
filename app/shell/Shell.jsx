// @flow

import React from 'react'
import Radium from 'radium'
import Reflux from 'reflux'
import { IntlProvider } from 'react-intl'

import { Actions, Storages, Stores } from 'electron-shell-services'
const { ActivityService, TranslationManager } = Actions
const { DocumentDatabase, FileStorage, SqlDatabase, TripleStore } = Storages
const { ActivityStore, TranslationStore } = Stores

import type { ApplicationConfig,
              ISqlDatabase, IDocumentDatabase, ITripleStore, IFileStorage,
              IActivityService, ITanslationManager } from 'electron-shell'

import Frame from './components/Frame'

/**
 * [config description]
 * @type {[type]}
 */
class Shell extends Reflux.Component {

  config : ApplicationConfig
  sqlDB : ISqlDatabase
  docDB : IDocumentDatabase
  graphDB : ITripleStore
  fileStore : IFileStorage

  activityService: IActivityService
  translationManager: ITanslationManager

  props : {
    config: ApplicationConfig,
    closeHandler: Function,
    fullScreenHandler: Function,
    minimizeHandler: Function
  }

  /**
   * Creates an instance of Shell.
   *
   */
  constructor(props, context) {
    super(props, context)

    this.config = this.props.config
    this.sqlDB = new SqlDatabase(this.config.app.name)
    this.docDB = new DocumentDatabase(this.config.app.name)
    this.graphDB = new TripleStore(this.config.app.name)
    this.fileStore = new FileStorage(this.config)

    this.activityService = ActivityService
    this.translationManager = TranslationManager
    this.stores = [ TranslationStore ]

    this.translationManager.switchLocale(this.config.defaultLocale, this.docDB)
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
      fileStorage: this.fileStore,
      translationManager: this.translationManager
    }
  }

  /**
   * minimizeApp - description
   *
   * @return {type}  description
   */
  minimizeApp() : void {
    this.props.minimizeHandler()
  }

  /**
   * toggleFullScreen - description
   *
   * @return {type}  description
   */
  toggleFullScreen() : void {
    this.props.fullScreenHandler()
  }

  /**
   * closeApp - description
   *
   * @return {type}  description
   */
  closeApp() : void {
    this.docDB.save({event: 'closed'}).then(() => {
      this.props.closeHandler()
    })
  }

  /**
   * render - description
   *
   * @return {type}  description
   */
  render() {
    console.log(this.state)
    return (
      <IntlProvider key={this.state.locale} locale={this.state.locale} messages={this.state.translations}>
        <Frame appName={this.config.app.name} appVersion={this.config.app.version} platform={this.config.platform}
               closeHandler={this.closeApp.bind(this)} maximizeHandler={this.toggleFullScreen.bind(this)}
               minimizeHandler={this.minimizeApp.bind(this)}/>
      </IntlProvider>
    )
  }
}

Shell.childContextTypes = {
  appConfig: React.PropTypes.object.isRequired,
  documentDatabase: React.PropTypes.object.isRequired,
  graphDatabase: React.PropTypes.object.isRequired,
  sqlDatabase: React.PropTypes.object.isRequired,
  fileStorage: React.PropTypes.object.isRequired,
  translationManager: React.PropTypes.object.isRequired
}

export default Radium(Shell)
