/* @flow*/
import electron from 'electron'

import React from 'react'
import ReactDOM from 'react-dom'
import Reflux from 'reflux'
import RefluxPromise from 'reflux-promise'

import injectTapEventPlugin from 'react-tap-event-plugin'

import Shell from './shell/Shell'

// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin()

const app = electron.remote.app

Reflux.use(RefluxPromise(window.Promise))

ReactDOM.render(
  <Shell config={app.sysConfig()}
         closeHandler={app.close}
         fullScreenHandler={app.toggleFullscreen}
         minimizeHandler={app.minimizeAppToSysTray} />,
  document.querySelector('div[role=app]'))
