// @flow

import Reflux from 'reflux'
import ShellActions from './ShellActions'

import type { ApplicationConfig, IDocumentDatabase } from 'electron-shell'

import viewSpecs from './config/views.json'
import initialData from './config/data.json'

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
      this.docDB.save(viewSpecs).then(() => {
        let initializing = initialData.map(d => this.docDB.save(d))
        return Promise.all(initializing)
      }).then(() => {
        this.setState({ initialized: true })
        resolve({})
      }).catch((error) => {
        this.setState({ initialized: false })
        reject(error)
      })
    })

    return initPromise
  }

  onMountActiveExtensions() {

    if (!this.state.initialize)
      throw 'ERR_NOT_INITIALIZED'

    let loading = [
      this.docDB.query('shell/extensions', { include_docs: true }),
      this.docDB.query('shell/settings', { include_docs: true })
    ]

    Promise.all(loading).then((results) => {
      let extensions = results[0].rows.map((item) => item.doc)
      let settings = results[1].rows.map((item) => item.doc)
      this.setState({ extensions: extensions, settings: settings })
    }).catch((error) => {
      console.log(error.toString())
      throw error
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
