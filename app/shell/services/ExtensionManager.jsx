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
  fileStorage: Object
  activeExtensions: Array

  constructor(appConfig:Object, fileStorage:Object) {
    this.fileStorage = fileStorage
    this.activeExtensions = []
    this.extensionFolder = path.join(this.fileStorage.baseFolder, 'Plugins')
    if(!fs.existsSync(this.extensionFolder)) {
      fs.mkdirSync(this.extensionFolder)
    }
    const baseDependencies = path.join(appConfig.paths.appPath, 'node_modules')
    const symlink = path.join(this.fileStorage.baseFolder, 'node_modules')
    if (!fs.existsSync(symlink) && (fs.existsSync(baseDependencies))) {
      fs.symlinkSync(baseDependencies, symlink, 'junction')
    }
  }

  _tryLoadExtension(extensionName: string): any {
    let extensionInfo: any = null
    process.noAsar = false

    try {
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

  activateExtension(extensionName: string): bool {
    let extensionInfo = this._tryLoadExtension(extensionName)
    if (extensionInfo)
      this.activeExtensions.push(extensionInfo)
    return (extensionInfo !== null)
  }

  deactivateExtension(extensionName: string) {

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

  get extensions() {
    return this.activeExtensions
  }
}

export default ExtensionManager
