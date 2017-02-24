// @flow

/**
 * Provides access to and manages a local storage
 * per user and extension
 *
 * @class FileStorage
 */
class FileStorage {

  dataFolder: string

  constructor(appConfig:Object) {
    this.dataFolder = appConfig.paths.data
  }

  get baseFolder(): string {
    return this.dataFolder
  }
}

export default FileStorage
