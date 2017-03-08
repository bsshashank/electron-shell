// @flow

import Reflux from 'reflux'

const StoreActions = Reflux.createActions([
  'mountActiveExtensions',
  'activateExtension',
  'deactivateExtension',
  'installExtension',
  'uninstallExtension',
  'switchLocale',
  'updateSettings'
])

export default StoreActions
