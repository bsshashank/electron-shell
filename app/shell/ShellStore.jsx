// @flow

import Reflux from 'reflux'
import ShellActions from './ShellActions'

import type { ApplicationConfig, IDocumentDatabase } from 'electron-shell'

var viewSpecs = {
  _id: '_design/shell',
  version: '0.1.0',
  views: {
    extensions: {
      map: function mapFun (doc) {
        if (doc.type === 'extension') {
          emit(doc.id, doc)
        }
      }.toString()
    },
    settings: {
      map: function mapFun (doc) {
        if (doc.type === 'setting') {
          emit (doc.extensionid, doc)
        }
      }.toString()
    }
  }
}

class ShellStore extends Reflux.Store {

  _appCfg: ApplicationConfig
  _docDB: IDocumentDatabase

  constructor(appConfig: ApplicationConfig, docDB: IDocumentDatabase) {
    super()
    this._appCfg = appConfig
    this._docDB = docDB

    this.state = {
      initialized: false,
      extensions: [],
      activeModule: "Home",
      locale: this._appCfg.defaultLocale,
      title: `${this._appCfg.app.name} ${this._appCfg.app.version}`
    }

    this.listenables = ShellActions
  }

  initialize() : Promise<Object> {

    let initPromise = new Promise((resolve, reject) => {
      this._docDB.save(viewSpecs)
    })

    return initPromise
  }

  onMountActiveExtensions() {

    let loading: Promise<Object>[] = [
      this._docDB.query('shell/extensions', { include_docs: true }),
      this._docDB.query('shell/settings', { include_docs: true })
    ]

    Promise.all(loading)
    .then((results) => {
      console.log(...results)
      /**let extensions = result.rows.map((item) => item.doc)
      let settings = result.rows.map((item) => item.doc)
      console.log(`Mount active extensions ${extensions.toString()} with settings ${settings.toString()}`)
      this.setState({ extensions: extensions, settings: settings }) **/
    })
    .catch((error) => {
      console.log(error.toString())
      console.log(Reflux.GlobalState)
    })
  }

  onActivateExtension(extension) {
    console.log(`Activate extension ${extension}`)
    this.setState({ extensions: extension })
  }

  onDeactivateExtension(extension) {
    console.log(`Deactivate extension ${extension}`)
    this.setState({ extensions: extension })
  }

  onInstallExtension(extension) {

  }

  onUninstallExtension(extension) {

  }

  onSwitchLocale(locale) {

  }

  onUpdateSettings(settings) {

  }
}

ShellStore.id = 'shell'

export default ShellStore
