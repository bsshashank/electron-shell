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

  config: ApplicationConfig
  docDB: IDocumentDatabase

  constructor(appConfig: ApplicationConfig, docDB: IDocumentDatabase) {

    super()
    this.config = appConfig
    this.docDB = docDB
    this.listenables = ShellActions

    this.state = {
      initialized: false,
      extensions: [],
      activeModule: "Home",
      locale: this.config.defaultLocale,
      title: `${this.config.app.name} ${this.config.app.version}`
    }
  }

  initialize() : Promise<Object> {

    let initPromise = new Promise((resolve, reject) => {
      this.docDB.save(viewSpecs).then(resolve).catch(reject)
    })

    return initPromise
  }

  onMountActiveExtensions() {

    let loading = [
      this.docDB.query('shell/extensions', { include_docs: true }),
      this.docDB.query('shell/settings', { include_docs: true })
    ]

    Promise.all(loading).then((results) => {
      let extensions = results[0].rows.map((item) => item.doc)
      let settings = results[1].rows.map((item) => item.doc)
      console.log(`Mount active extensions ${extensions.toString()} with settings ${settings.toString()}`)
      this.setState({ extensions: extensions, settings: settings })
    }).catch((error) => {
      console.log(error.toString())
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
