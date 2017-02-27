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

  _extensionFolder: string
  _fileStorage: Object

  constructor(appConfig:Object, fileStorage:Object) {
    this._fileStorage = fileStorage
    this._extensionFolder = path.join(this._fileStorage.baseFolder, 'Plugins')
    if(!fs.existsSync(this._extensionFolder)) {
      fs.mkdirSync(this._extensionFolder)
    }
    const baseDependencies = path.join(appConfig.paths.appPath, 'node_modules')
    const symlink = path.join(this._fileStorage.baseFolder, 'node_modules')
    if (!fs.existsSync(symlink) && (fs.existsSync(baseDependencies))) {
      fs.symlinkSync(baseDependencies, symlink, 'junction')
    }
  }

  tryLoadExtension(extensionName: string): any {
    let extensionInfo: any = null
    process.noAsar = false

    try {
      const extension = require(path.join(this._extensionFolder, extensionName))
      const extensionMeta = require(path.join(this._extensionFolder, extensionName, '/package.json'))
      extensionInfo = {
        component: extension.default,
        root: uri.parse(this._extensionFolder),
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

  installExtension(from: string) {
    if (fs.lstatSync(from).isDirectory()) {
      console.log('Handling of unpacked plugin...')
    }
    else {
      console.log('About to install plugin from ', from)

    }
  }

  uninstallExtension(extensionName: string) {

  }
}

export default ExtensionManager
