// @flow

import path from 'path'
import fs from 'fs'
import ncp from 'ncp'

/**
 * Provides access to and manages a local storage
 * per user and extension
 *
 * @class FileStorage
 */
class FileStorage {

  dataDir: string
  tempDir: string

  constructor(appConfig:Object) {
    this.dataDir = appConfig.paths.data
    this.tempDir = appConfig.paths.temp
  }

  get baseFolder(): string {
    return this.dataDir
  }

  get tempFolder(): string {
    return this.tempDir
  }
}

export default FileStorage
