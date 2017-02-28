// @flow

import MainLayout from '../components/MainLayout'
import Home from '../components/Home'
import SettingsManager from '../components/SettingsManager'

/**
 * Manages and maintains all routes internal to the
 * application. Allows extensions to register new routes on their behalf.
 *
 * @class RouteHandler
 */
class RouteHandler {

  _appConfig: Object
  _extensionManager: Object
  _routes: Map

  constructor (appConfig, extensionManager) {
    this._appConfig = appConfig
    this._extensionManager = extensionManager
    this._routes = {
      path: '/',
      component: MainLayout,
      indexRoute: { component: Home },
      childRoutes: [{
        path: 'settings',
        component: SettingsManager
      }]
    }
  }

  get routes () {
    return this._routes
  }

}

export default RouteHandler
