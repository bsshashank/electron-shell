// @flow

import Reflux from 'reflux'
import ShellActions from './ShellActions'

import { addLocaleData } from 'react-intl'

import type { ApplicationConfig, IDocumentDatabase } from 'electron-shell'

import viewSpecs from './config/views.json'
import initialData from './config/data.json'

/**
 * Stores shell related configuration information
 * @type {[type]}
 */
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
      defaultModule: 'Home',
      locale: this.config.defaultLocale,
      title: `${this.config.app.name} ${this.config.app.version}`,
      name: this.config.app.name,
      version: this.config.app.version,
      translations: {}
    }

    this.setNewLocale(this.state.locale)
  }

  initialize() : Promise<Object> {

    let initPromise = new Promise((resolve, reject) => {
      this.docDB.save(viewSpecs).then(() => {
        let initializing = initialData.map(d => this.docDB.save(d))
        return Promise.all(initializing)
      }).then(() => {
        return this.docDB.query('shell/translations', { key: this.state.locale, include_docs: true })
      }).then((translations) => {
        let messages = {}
        translations.rows.forEach((row) => {
          messages[row.id] = row.doc.translation || row.doc.defaultMessage
        })
        this.setState({ initialized: true, translations: messages })
        resolve({})
      }).catch((error) => {
        this.setState({ initialized: false })
        reject(error)
      })
    })

    return initPromise
  }

  onMountActiveExtensions() {

    if (!this.state.initialized)
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

  onSwitchLocale(locale:string) {
    this.setNewLocale(locale)
    this.setState({ locale: locale })
  }

  onUpdateSettings(settings) {

  }

  setNewLocale(locale:string) {
    const idx = locale.indexOf('-')
    if (idx !== -1) {
      locale = locale.substr(0, idx)
    }
    try {
      const locale_data = require(`react-intl/locale-data/${locale}`)
      addLocaleData([...locale_data])
    }
    catch(err) {
      console.log(`Could not load locale ${locale}`)
      throw 'ERR_SWITCH_LOCALE'
    }
  }
}

ShellStore.id = 'shell'

export default ShellStore
