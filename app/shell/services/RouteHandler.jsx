// @flow

import MainLayout from '../views/MainLayout'
import Home from '../views/Home'
import SettingsManager from '../views/SettingsManager'

/**
 * Manages and maintains all routes internal to the
 * application. Allows extensions to register new routes on their behalf.
 *
 * @class RouteHandler
 */
class RouteHandler {

  config: Object
  extensionManager: Object
  routeMap: Map

  constructor (appConfig, extensionManager) {
    this.config = appConfig
    this.extensionManager = extensionManager
    this.routeMap = {
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
    return this.routeMap
  }

}

export default RouteHandler
