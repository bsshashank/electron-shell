// @flow

import React from 'react'
import Radium from 'radium'

import Icon from 'react-icons-kit'
import { ic_home } from 'react-icons-kit/md/ic_home'
import { ic_settings } from 'react-icons-kit/md/ic_settings'

import { defineMessages, intlShape, injectIntl } from 'react-intl'
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'

import { Views } from 'electron-shell-ui'
const { MainLayout, Home, SettingsManager } = Views

import { WindowStyle } from '../styles/ControlStyles'
import TitleBar from './TitleBar'

/**
 * [Frame description]
 * @param {[type]} intl            [description]
 * @param {[type]} platform        [description]
 * @param {[type]} appName         [description]
 * @param {[type]} appVersion      [description]
 * @param {[type]} closeHandler    [description]
 * @param {[type]} maximizeHandler [description]
 * @param {[type]} minimizeHandler [description]
 */
const Frame = ({ intl, platform, appName, appVersion, closeHandler, maximizeHandler, minimizeHandler }: { intl: intlShape, platform: string, appName: string, appVersion: string, closeHandler: Function, maximizeHandler: Function, minimizeHandler: Function }) => {

  const messages = defineMessages({
    appTitle: {
      id: 'app.title',
      description: 'The application title in the window',
      defaultMessage: '{pkgname} {pkgversion}'
    },
    appMnuTitle: {
      id: 'app.mnu.title',
      description: 'The application name in the menu bar',
      defaultMessage: '{pkgname}'
    },
    appMnuHome: {
      id: 'app.mnu.Home',
      description: 'The menu item for the Home extension',
      defaultMessage: 'Home'
    },
    appMnuSettings: {
      id: 'app.mnu.Settings',
      description: 'The menu item for the Settings extension',
      defaultMessage: 'Settings'
    }
  })

  const { formatMessage } = intl

  let menuConfig = [
    { type: 'link', href: '/', icon: ic_home, name: formatMessage(messages.appMnuHome) },
    { type: 'spacer' },
    { type: 'link', href: '/settings', icon: ic_settings, name: formatMessage(messages.appMnuSettings) }
  ]

  return (
    <div style={[WindowStyle]}>
      <TitleBar platform={platform} title={formatMessage(messages.appTitle, { pkgname: appName, pkgversion: appVersion })}
                closeHandler={closeHandler} maximizeHandler={maximizeHandler} minimizeHandler={minimizeHandler} />
      <BrowserRouter>
        <MainLayout title={formatMessage(messages.appMnuTitle, { pkgname: appName })} menu={menuConfig}>
          <Switch>
            <Route path='/settings' component={SettingsManager} />
            <Route component={Home} />
          </Switch>
        </MainLayout>
      </BrowserRouter>
    </div>
  )
}

export default injectIntl(Radium(Frame))
