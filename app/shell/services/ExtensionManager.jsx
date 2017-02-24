// @flow

import path from 'path'
import fs from 'fs'
import uri from 'url'

/**
 * Provides access to and manages extensions registered
 * with the application
 *
 * @class ExtensionManager
 */
class ExtensionManager {

  extensionFolder: string

  constructor(appConfig:Object) {

    this.extensionFolder = path.join(appConfig.paths.appPath, 'plugins')

    try {
      if (!fs.existsSync(this.extensionFolder)) {
        fs.mkdirSync(this.extensionFolder)
      }
      fs.accessSync(this.extensionFolder, fs.R_OK | fs.W_OK)
    }
    catch(err) {
      // can't write to app folder, create a plugin structure in user folder instead
      this.extensionFolder = path.join(appConfig.paths.data, 'plugins')
      const baseDependencies = path.join(appConfig.paths.appPath, 'node_modules')
      const symlink = path.join(appConfig.paths.data, 'node_modules')
      if (!fs.existsSync(symlink) && (fs.existsSync(baseDependencies))) {
        fs.symlinkSync(baseDependencies, symlink, 'dir')
      }
      if(!fs.existsSync(this.extensionFolder)) {
        fs.mkdirSync(this.extensionFolder)
      }
    }
  }

  tryLoadExtension(extensionName: string): ?Object {
    let extensionInfo: ?Object = null
    try {
      process.noAsar = false
      const extension = require(path.join(this.extensionFolder, extensionName))
      const extensionMeta = require(path.join(this.extensionFolder, extensionName, '/package.json'))
      extensionInfo = {
        component: extension.default,
        root: uri.parse(this.extensionFolder),
        location: extensionName,
        module: extensionMeta,
        path: extensionMeta.config.path
      }
    } catch(ex) {
      console.log(ex)
      extensionInfo = undefined
    }
    // process.noAsar = true
    return extensionInfo
  }
}

export default ExtensionManager
