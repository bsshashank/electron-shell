// @flow

import React from 'react'
import Radium from 'radium'

import { IntlProvider, defineMessages } from 'react-intl';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'

import Icon from 'react-icons-kit'
import { ic_home } from 'react-icons-kit/md/ic_home'
import { ic_settings_applications } from 'react-icons-kit/md/ic_settings_applications'

import { Services, Storages } from 'electron-shell-services'
import { Components, Views } from 'electron-shell-ui'

const { ExtensionManager, SettingsManager } = Services
const { DocumentDatabase, FileStorage, SqlDatabase, TripleStore } = Storages
const { MainLayout, Home, SettingsManager: SettingsManagerUI } = Views

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

  props: {
    config: ApplicationConfig,
    closeHandler: Function,
    fullScreenHandler: Function,
    minimizeHandler: Function
  }

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
    }).catch((err) => {
      console.log(err.toString())
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

    const messages = defineMessages({
      'app.mnu.Home': {
        id: 'app.mnu.Home',
        description: 'The menu item for the Home extension',
        defaultMessage: 'Home'
      },
      'app.mnu.Settings': {
        id: 'app.mnu.Settings',
        description: 'The menu item for the Settings extension',
        defaultMessage: 'Settings'
      }
    })

    let menuConfig = [
      { type: 'link', href: '/', icon: ic_home, name: messages['app.mnu.Home'] },
      { type: 'spacer' },
      { type: 'link', href: '/settings', icon: ic_settings_applications, name: messages['app.mnu.Settings'] }
    ]

    if (!this.state.initialized) {
      return (
        <div style={[WindowStyle]}>
          <TitleBar platform={this.config.platform} title={this.state.title}
                    closeHandler={this.closeApp.bind(this)} maximizeHandler={this.toggleFullScreen.bind(this)}
                    minimizeHandler={this.minimizeApp.bind(this)} />
        </div>
      )
    } else {
      return (
        <div style={[WindowStyle]}>
          <TitleBar platform={this.config.platform} title={this.state.title}
                    closeHandler={this.closeApp.bind(this)} maximizeHandler={this.toggleFullScreen.bind(this)}
                    minimizeHandler={this.minimizeApp.bind(this)} />
          <IntlProvider key={this.state.locale} locale={this.state.locale} messages={this.state.translations}>
            <BrowserRouter>
              <MainLayout title={this.state.name} menu={menuConfig}>
                <Switch>
                  <Route path='/settings' component={SettingsManagerUI} />
                  <Route path='/settings/:app' component={SettingsManagerUI} />
                  <Route component={Home} />
                </Switch>
              </MainLayout>
            </BrowserRouter>
          </IntlProvider>
        </div>
      )
    }
  }
}

Shell.childContextTypes = {
  appConfig: React.PropTypes.object.isRequired,
  documentDatabase: React.PropTypes.object.isRequired,
  graphDatabase: React.PropTypes.object.isRequired,
  sqlDatabase: React.PropTypes.object.isRequired,
  fileStorage: React.PropTypes.object.isRequired
}

export default Radium(Shell)
