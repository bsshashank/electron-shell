// @flow
import electron from 'electron'
import React from 'react'
import Radium from 'radium'
import { Icon, Tooltip } from 'react-mdl'
import { Link } from 'react-router'
import { connect } from 'nuclear-js-react-addons'

import DocumentDatabase from './services/DocumentDatabase'
import SqlDatabase from './services/SqlDatabase'
import TripleStore from './services/TripleStore'

import Window from './Window'

const app = electron.remote.app
const appCfg = app.sysConfig()

/**
 *
 *
 * @class Shell
 * @extends {React.Component}
 */
class Shell extends React.Component {

  title: string
  sqlDB: SqlDatabase
  docDB: DocumentDatabase
  graphDB: TripleStore

  /**
   * Creates an instance of Shell.
   *
   */
  constructor (props) {
    super(props)
    this.title = `${appCfg.app.name} ${appCfg.app.version}`
    this.sqlDB = new SqlDatabase(appCfg.app.name)
    this.docDB = new DocumentDatabase(appCfg.app.name)
    this.graphDB = new TripleStore(appCfg.app.name)
  }

  /**
   * getChildContext - description
   *
   * @return {type}  description
   */
  getChildContext() {
    return {
      appConfig: appCfg,
      documentDatabase: this.docDB,
      graphDatabase: this.graphDB,
      sqlDatabase: this.sqlDB
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
    this.docDB.save({ event: 'closed' }).then(() => {
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
    let activeModule = appCfg.app.name

    /*this.props.plugins.toArray().map((r) => {
      const plugin = r.toJS()
      modules.push(<Link to={plugin.path} key={plugin.path}>
                      <Icon name={plugin.module.config.icon} style={{ paddingRight: '10px' }} />
                      {plugin.module.config.label}
                    </Link>)
    })*/

    return (
      <Window appName={this.title}
        activeModule={activeModule}
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
  sqlDatabase: React.PropTypes.object.isRequired
}

function dataBinding(props) {
  return {
    plugins: ['plugins']
  }
}

export default connect(dataBinding)(Shell)
