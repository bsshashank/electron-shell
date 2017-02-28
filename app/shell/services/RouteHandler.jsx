// @flow

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
  }

  get routes () {
    return this._routes
  }

}

export default RouteHandler
