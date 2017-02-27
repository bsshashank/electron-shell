// @flow

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

  constructor (appConfig, extensionManager, homeComponent) {
    this._appConfig = appConfig
    this._extensionManager = extensionManager
    this._routes = {
      path: '/',
      component: homeComponent,
      childRoutes: []
    }
    this._routes.childRoutes.push({
      path: 'settings',
      component: SettingsManager,
      childRoutes: []
    })
  }

  get routes () {
    return this._routes
  }

}

export default RouteHandler
