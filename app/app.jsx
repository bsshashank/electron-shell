// @flow

import electron from 'electron'

import React from 'react'
import ReactDOM from 'react-dom'
import injectTapEventPlugin from 'react-tap-event-plugin'

import { Provider } from 'nuclear-js-react-addons'
import reactor from './shell/Reactor'
import Shell from './shell/Shell'

// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin()

ReactDOM.render(
  <Provider reactor={reactor}>
    <Shell />
  </Provider>, document.querySelector('div[role=app]')
)
