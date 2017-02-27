// @flow

import ActionTypes from './ShellActionTypes'

class ShellActions {

  _reactor: Object
  _extensionManager: Object
  _documentDatabase: Object

  constructor(reactor: Object, documentDatabase: Object, extensionManager: Object) {
    this._reactor = reactor
    this._extensionManager = extensionManager
    this._documentDatabase = documentDatabase
  }

  mountAvailableExtensions () {
    let extensions = []
    // blah blah folder lookup
    // blah blah loading asar files via ExtensionManager
    this._reactor.dispatch(ActionTypes.MOUNT_AVAILABLE_EXTENSIONS, { extensions: extensions })
  }

  activateExtension (extension:string) {
    // blah blah lookup extension
    // blah blah load asar file via ExtensionManager
    this._reactor.dispatch(ActionTypes.ACTIVATE_EXTENSION, extension)
  }

  deactivateExtension (extension:string) {
    // blah blah unload extension
    // blah blah remove extension
    this._reactor.dispatch(ActionTypes.DEACTIVATE_EXTENSION, extension)
  }

  updateExtension (extension:string) {
    // blah blah unload extension
    // blah blah remove old extension
    // blah blah load new extension
    this._reactor.dispatch(ActionTypes.UPDATE_EXTENSION, extension)
  }

  switchLanguage (language:string) {
    // blah blah load language file
    // blah blah parse content
    this._reactor.dispatch(ActionTypes.SWITCH_LANGUAGE, language)
  }

  updateSettings (extension:string, settings:JSON) {
    // blah blah update settings
    // blah blah persist settings
    this._reactor.dispatch(ActionTypes.UPDATE_SETTINGS, { extension: extension, settings: settings })
  }
}

export default ShellActions
