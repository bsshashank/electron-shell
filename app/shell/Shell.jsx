// @flow

import React from 'react'
import Radium from 'radium'
import Reflux from 'reflux'
import { object } from 'prop-types'

import path from 'path'
import glob from 'glob-promise'
import { IntlProvider } from 'react-intl'

import { utils } from 'electron-shell-lib'

import { Actions, Storages, Stores } from 'electron-shell-services'
const { ActivityService, CommandHandler, ExtensionManager, SettingManager, TranslationManager } = Actions
const { DocumentDatabase, FileStorage, SqlDatabase, TripleStore } = Storages
const { ActivityStore, CommandStore, ExtensionStore, SettingStore, TranslationStore } = Stores

import type { ApplicationConfig, ExtensionInfoType, IExtension,
  ISqlDatabase, IDocumentDatabase, ITripleStore, IFileStorage,
  IActivityService, ICommandHandler, IExtensionManager, ISettingManager, ITranslationManager
} from 'electron-shell-lib'

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
  commandHandler: ICommandHandler
  extensionManager: IExtensionManager
  settingManager: ISettingManager
  translationManager: ITranslationManager

  activityStore: ActivityStore
  commandStore: CommandStore
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
    this.commandHandler = CommandHandler
    this.extensionManager = ExtensionManager
    this.settingManager = SettingManager
    this.translationManager = TranslationManager

    this.activityStore = Reflux.initStore(ActivityStore)
    this.commandStore = Reflux.initStore(CommandStore)
    this.extensionStore = Reflux.initStore(ExtensionStore)
    this.settingStore = Reflux.initStore(SettingStore)
    this.translationStore = Reflux.initStore(TranslationStore)

    this.stores = [ActivityStore, ExtensionStore, SettingStore, TranslationStore]
    this.state = {
      shellIsInitialized: false
    }
  }

  componentDidMount() {

    let initPromises = [
      this.activityService.initialize.triggerAsync(this.docDB),
      this.settingManager.initialize.triggerAsync(this.docDB),
      this.translationManager.initialize.triggerAsync(this.docDB),
      this.extensionManager.initialize.triggerAsync(this.fileStore, this.docDB, this.settingManager, this.translationManager),
    ]

    Promise.all(initPromises).then(() => {
      const assetFolder = path.join(this.config.paths.appPath, 'assets/msgs/**.json')
      glob(assetFolder).then((languageFiles) => {
        let importJobs = languageFiles.map((languageFile) => {
          const fileExt = path.extname(languageFile)
          const fileName = path.basename(languageFile, fileExt)
          let content = require(languageFile)
          return this.translationManager.import.triggerAsync(fileName, content)
        })
        Promise.all(importJobs).then(() => {
          return this.translationManager.switchLocale.triggerAsync(this.config.defaultLocale)
        }).then(() => {
          let defaultSettings = require(path.join(this.config.paths.appPath, 'assets/default_settings.json'))
          return this.settingManager.import.triggerAsync(defaultSettings)
        }).then(() => {
          return this.extensionManager.mountAll.triggerAsync()
        }).then(() => {
          this.setState({ shellIsInitialized: true })
        }).catch((err) => {
          console.log(err)
        })
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
      commandHandler: this.commandHandler,
      extensionManager: this.extensionManager,
      settingManager: this.settingManager,
      translationManager: this.translationManager,
      activityStore: this.activityStore,
      commandStore: this.commandStore,
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
    if (!this.state.shellIsInitialized) {
      return (
        <div>Initializing....</div>
      )
    }
    else {
      let activeExtensions = this.state.extensions.filter((e:ExtensionInfoType) => e.status === 'active')
      const pluginFolder = path.join(this.fileStore.baseFolder, 'Plugins')
      let extensions = activeExtensions.map((e:ExtensionInfoType) => {
        let extItf:IExtension = utils.extensionLoader.tryLoadExtension(pluginFolder, e.package)
        if (extItf) {
          let extensionStorage:IFileStorage = this.fileStore.getExtensionFolder(extItf.id)
          extItf.initialize(extensionStorage, this.commandHandler, this.state.settings[extItf.id] || {}, extItf.id.toLowerCase())
        }
        return extItf
      })
      return (
        <IntlProvider key={this.state.locale} locale={this.state.locale} messages={this.state.localeData.intl}>
          <Frame appName={this.config.app.name} appVersion={this.config.app.version} platform={this.config.platform}
            closeHandler={this.closeApp.bind(this)} maximizeHandler={this.toggleFullScreen.bind(this)}
            minimizeHandler={this.minimizeApp.bind(this)}
            extensions={extensions} redirectTo={`/${this.state.settings.app.defaultModule}`}/>
        </IntlProvider>
      )
    }
  }
}

Shell.childContextTypes = {
  appConfig: object.isRequired,
  documentDatabase: object.isRequired,
  graphDatabase: object.isRequired,
  sqlDatabase: object.isRequired,
  activityService: object.isRequired,
  commandHandler: object.isRequired,
  extensionManager: object.isRequired,
  settingManager: object.isRequired,
  translationManager: object.isRequired,
  activityStore: object.isRequired,
  commandStore: object.isRequired,
  extensionStore: object.isRequired,
  settingStore: object.isRequired,
  translationStore: object.isRequired
}

export default Radium(Shell)
