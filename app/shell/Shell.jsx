// @flow
import electron from 'electron'
import React from 'react'
import Radium from 'radium'
import { Icon, Tooltip } from 'react-mdl'
import { Link } from 'react-router'
import { connect } from 'nuclear-js-react-addons'
import { toImmutable } from 'nuclear-js'

import DocumentDatabase from './services/DocumentDatabase'
import FileStorage from './services/FileStorage'
import SqlDatabase from './services/SqlDatabase'
import TripleStore from './services/TripleStore'

import Window from './Window'

import ExtensionManager from './services/ExtensionManager'

import ShellActions from './actions/ShellActions'
import ShellStore from './store/ShellStore'

const app = electron.remote.app
const appCfg = app.sysConfig()

/**
 *
 *
 * @class Shell
 * @extends {React.Component}
 */
class Shell extends React.Component {

  _sqlDB: SqlDatabase
  _docDB: DocumentDatabase
  _graphDB: TripleStore
  _fileStore: FileStorage
  _extensionManager: ExtensionManager
  _shellActions: ShellActions

  /**
   * Creates an instance of Shell.
   *
   */
  constructor (props) {
    super(props)
    this._sqlDB = new SqlDatabase(appCfg.app.name)
    this._docDB = new DocumentDatabase(appCfg.app.name)
    this._graphDB = new TripleStore(appCfg.app.name)
    this._fileStore = new FileStorage(appCfg)

    this._extensionManager = new ExtensionManager(appCfg, this._fileStore)

    this.state = {
      locale: appCfg.defaultLocale,
      title: `${appCfg.app.name} ${appCfg.app.version}`,
      activeModule: appCfg.app.name
    }

    this.props.reactor.registerStores({
      'app': ShellStore
    });

    // mount all available extensions
    this._shellActions = new ShellActions(this.props.reactor, this._docDB, this._extensionManager)
    this._shellActions.mountAvailableExtensions()
  }

  /**
   * getChildContext - description
   *
   * @return {type}  description
   */
  getChildContext() {
    return {
      appConfig: appCfg,
      documentDatabase: this._docDB,
      graphDatabase: this._graphDB,
      sqlDatabase: this._sqlDB,
      extensionManager: this._extensionManager
    }
  }

  /**
   * minimizeApp - description
   *
   * @return {type}  description
   */
  minimizeApp () {
    app.minimizeAppToSysTray()
  }

  /**
   * toggleFullScreen - description
   *
   * @return {type}  description
   */
  toggleFullScreen () {
    app.toggleFullscreen()
  }

  /**
   * closeApp - description
   *
   * @return {type}  description
   */
  closeApp () {
    this._docDB.save({ event: 'closed' }).then(() => {
      app.close()
    })
  }

  /**
   * render - description
   *
   * @return {type}  description
   */
  render () {
    let modules = []

    this.props.app.extensions.toArray().map((item) => {
      const extension = item.toJS()
      modules.push(<Link to={extension.path} key={extension.path}>
                      <Icon name={extension.module.config.icon} style={{ paddingRight: '10px' }} />
                      {extension.module.config.label}
                    </Link>)
    })

    return (
      <Window appName={this.state.title}
        activeModule={this.state.activeModule}
        modules={modules}
        platform={appCfg.platform}
        closeHandler={this.closeApp.bind(this)}
        fullScreenHandler={this.toggleFullScreen.bind(this)}
        minimizeHandler={this.minimizeApp.bind(this)}>
          {this.props.children}
      </Window>
    )
  }
}

Shell.childContextTypes = {
  appConfig: React.PropTypes.object.isRequired,
  documentDatabase: React.PropTypes.object.isRequired,
  graphDatabase: React.PropTypes.object.isRequired,
  sqlDatabase: React.PropTypes.object.isRequired,
  extensionManager: React.PropTypes.object.isRequired
}

Shell.propTypes = {
  reactor: React.PropTypes.object.isRequired
}

Shell.defaultProps = {
  app: {
    extensions: toImmutable([])
  }
}

function dataBinding(props) {
  return {
    app: ['app']
  }
}

export default connect(dataBinding)(Shell)
