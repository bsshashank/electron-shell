// @flow

import ActionTypes from './ShellActionTypes'

class ShellActions {

  reactor: Object
  extensionManager: Object
  documentDatabase: Object

  constructor(reactor: Object, documentDatabase: Object, extensionManager: Object) {
    this.reactor = reactor
    this.extensionManager = extensionManager
    this.documentDatabase = documentDatabase
  }

  mountAvailableExtensions () {
    let extensions = []
    // blah blah folder lookup
    // blah blah loading asar files via ExtensionManager
    this.reactor.dispatch(ActionTypes.MOUNT_AVAILABLE_EXTENSIONS, { extensions: extensions })
  }

  activateExtension (extension:string) {
    // blah blah lookup extension
    // blah blah load asar file via ExtensionManager
    this.reactor.dispatch(ActionTypes.ACTIVATE_EXTENSION, extension)
  }

  deactivateExtension (extension:string) {
    // blah blah unload extension
    // blah blah remove extension
    this.reactor.dispatch(ActionTypes.DEACTIVATE_EXTENSION, extension)
  }

  updateExtension (extension:string) {
    // blah blah unload extension
    // blah blah remove old extension
    // blah blah load new extension
    this.reactor.dispatch(ActionTypes.UPDATE_EXTENSION, extension)
  }

  switchLanguage (language:string) {
    // blah blah load language file
    // blah blah parse content
    this.reactor.dispatch(ActionTypes.SWITCH_LANGUAGE, language)
  }

  updateSettings (extension:string, settings:JSON) {
    // blah blah update settings
    // blah blah persist settings
    this.reactor.dispatch(ActionTypes.UPDATE_SETTINGS, { extension: extension, settings: settings })
  }
}

export default ShellActions
