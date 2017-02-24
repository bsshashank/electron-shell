// @flow

import path from 'path'
import fs from 'fs'
import asar from 'asar'
import ncp from 'ncp'

/**
 * Provides access to and manages a local storage
 * per user and extension
 *
 * @class FileStorage
 */
class FileStorage {

  _dataFolder: string
  _tempFolder: string

  constructor(appConfig:Object) {
    this._dataFolder = appConfig.paths.data
    this._tempFolder = appConfig.paths.temp
  }

  get baseFolder(): string {
    return this._dataFolder
  }

  get tempFolder(): string {
    return this._tempFolder
  }
}

export default FileStorage
