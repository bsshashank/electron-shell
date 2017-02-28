// @flow

/**
 * Provides access to and manages activities done in the application
 * by the user or any system agent (aka log/trace)
 *
 * @class ActivityService
 */
class ActivityService {

  _appCfg: Object
  _docDatabase: Object

  constructor (appConfig, documentDatabase) {
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
