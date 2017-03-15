// @flow

import type { ApplicationConfig, IDocumentDatabase } from 'electron-shell'

/**
 * Provides access to and manages activities done in the application
 * by the user or any system agent (aka log/trace)
 *
 * @class ActivityService
 */
class ActivityService {

  config: ApplicationConfig
  docDB: IDocumentDatabase

  constructor (appConfig: ApplicationConfig, docDB: IDocumentDatabase) {
    this.config = appConfig
    this.docDB = docDB
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
