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
