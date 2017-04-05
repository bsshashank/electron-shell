// @flow

import React from 'react'
import Radium from 'radium'
import Reflux from 'reflux'
import { IntlProvider } from 'react-intl'

import { Actions, Storages, Stores } from 'electron-shell-services'
const { ActivityService, ExtensionManager, SettingManager, TranslationManager } = Actions
const { DocumentDatabase, FileStorage, SqlDatabase, TripleStore } = Storages
const { ActivityStore, ExtensionStore, SettingStore, TranslationStore } = Stores

import type { ApplicationConfig,
  ISqlDatabase, IDocumentDatabase, ITripleStore, IFileStorage,
  IActivityService, IExtensionManager, ISettingManager, ITranslationManager
} from 'electron-shell'

import Frame from './components/Frame'

/**
 * [config description]
 * @type {[type]}
 */
class Shell extends Reflux.Component {

  config: ApplicationConfig
  sqlDB: ISqlDatabase
  docDB: IDocumentDatabase
  graphDB: ITripleStore
  fileStore: IFileStorage

  activityService: IActivityService
  extensionManager: IExtensionManager
  settingManager: ISettingManager
  translationManager: ITranslationManager

  activityStore: ActivityStore
  extensionStore: ExtensionStore
  settingStore: SettingStore
  translationStore: TranslationStore

  props: {
    config: ApplicationConfig,
    closeHandler: Function,
    fullScreenHandler: Function,
    minimizeHandler: Function
  }

  /**
   * [constructor description]
   * @param  {[type]} props   [description]
   * @param  {[type]} context [description]
   * @return {[type]}         [description]
   */
  constructor(props, context) {
    super(props, context)

    this.config = this.props.config
    this.sqlDB = new SqlDatabase(this.config.app.name)
    this.docDB = new DocumentDatabase(this.config.app.name)
    this.graphDB = new TripleStore(this.config.app.name)
    this.fileStore = new FileStorage(this.config)

    this.activityService = ActivityService
    this.extensionManager = ExtensionManager
    this.settingManager = SettingManager
    this.translationManager = TranslationManager

    this.activityStore = Reflux.initStore(ActivityStore)
    this.extensionStore = Reflux.initStore(ExtensionStore)
    this.settingStore = Reflux.initStore(SettingStore)
    this.translationStore = Reflux.initStore(TranslationStore)

    this.stores = [ActivityStore, ExtensionStore, SettingStore, TranslationStore]
  }

  componentDidMount() {

    this.activityService.initialize(this.docDB)
    this.extensionManager.initialize(this.fileStore, this.docDB)
    this.settingManager.initialize(this.docDB)
    this.translationManager.initialize(this.docDB)

    this.fileStore.iterate(this.config.paths.appPath, 'assets/msgs/**.json').then((languageFiles) => {
      let importJobs = languageFiles.map((languageFile) => {
        let content = require(`${languageFile.folder}/${languageFile.name}${languageFile.ext}`)
        let p = new Promise((resolve, reject) => {
          this.translationManager.import(languageFile.name, content)
          resolve({})
        })
        return p
      })
      Promise.all(importJobs).then(() => {
        this.translationManager.switchLocale(this.config.defaultLocale)
      })
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
      activityService: this.activityService,
      extensionManager: this.extensionManager,
      settingManager: this.settingManager,
      translationManager: this.translationManager,
      activityStore: this.activityStore,
      extensionStore: this.extensionStore,
      settingStore: this.settingStore,
      translationStore: this.translationStore
    }
  }

  /**
   * minimizeApp - description
   *
   * @return {type}  description
   */
  minimizeApp(): void {
    this.props.minimizeHandler()
  }

  /**
   * toggleFullScreen - description
   *
   * @return {type}  description
   */
  toggleFullScreen(): void {
    this.props.fullScreenHandler()
  }

  /**
   * closeApp - description
   *
   * @return {type}  description
   */
  closeApp(): void {
    this.docDB.save({ event: 'closed' }).then(() => {
      this.props.closeHandler()
    })
  }

  /**
   * render - description
   *
   * @return {type}  description
   */
  render() {
    return (
      <IntlProvider key={this.state.locale} locale={this.state.locale} messages={this.state.localeData.intl}>
        <Frame appName={this.config.app.name} appVersion={this.config.app.version} platform={this.config.platform}
          closeHandler={this.closeApp.bind(this)} maximizeHandler={this.toggleFullScreen.bind(this)}
          minimizeHandler={this.minimizeApp.bind(this)} />
      </IntlProvider>
    )
  }
}

Shell.childContextTypes = {
  appConfig: React.PropTypes.object.isRequired,
  documentDatabase: React.PropTypes.object.isRequired,
  graphDatabase: React.PropTypes.object.isRequired,
  sqlDatabase: React.PropTypes.object.isRequired,
  activityService: React.PropTypes.object.isRequired,
  extensionManager: React.PropTypes.object.isRequired,
  settingManager: React.PropTypes.object.isRequired,
  translationManager: React.PropTypes.object.isRequired,
  activityStore: React.PropTypes.object.isRequired,
  extensionStore: React.PropTypes.object.isRequired,
  settingStore: React.PropTypes.object.isRequired,
  translationStore: React.PropTypes.object.isRequired
}

export default Radium(Shell)
