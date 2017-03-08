// @flow

import type { ApplicationConfig, DocumentDatabase } from 'electron-shell'

/**
 * Provides access to and manages activities done in the application
 * by the user or any system agent (aka log/trace)
 *
 * @class ActivityService
 */
class ActivityService {

  _appCfg: ApplicationConfig
  _docDatabase: DocumentDatabase

  constructor (appConfig: ApplicationConfig, documentDatabase: DocumentDatabase) {
    this._appCfg = appConfig
    this._docDatabase = documentDatabase
  }

  addEvent (event:string, message:string) {

  }

  get events () {
    return []
  }

  writeLogEntry (severity, extName:string, funcName:string, message:string) {

  }
}

export default ActivityService
