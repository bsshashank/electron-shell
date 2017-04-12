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

import type { IExtension } from 'electron-shell-lib'

/**
 * [Frame description]
 * @param {[type]} intl            [description]
 * @param {[type]} extensions      [description]
 * @param {[type]} platform        [description]
 * @param {[type]} appName         [description]
 * @param {[type]} appVersion      [description]
 * @param {[type]} closeHandler    [description]
 * @param {[type]} maximizeHandler [description]
 * @param {[type]} minimizeHandler [description]
 * @param {[type]} extensions      [description]
 * @param {[type]} platform        [description]
 * @param {[type]} appName         [description]
 * @param {[type]} appVersion      [description]
 * @param {[type]} closeHandler    [description]
 * @param {[type]} maximizeHandler [description]
 * @param {[type]} minimizeHandler [description]
 */
const Frame = ({ intl, extensions, platform, appName, appVersion, closeHandler, maximizeHandler, minimizeHandler, redirectTo }: { intl: intlShape, extensions: Array<IExtension>, platform: string, appName: string, appVersion: string, closeHandler: Function, maximizeHandler: Function, minimizeHandler: Function, redirectTo: string }) => {

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
    { type: 'link', href: redirectTo, icon: ic_home, name: formatMessage(messages.appMnuHome) }
  ]

  menuConfig.push(...extensions.map(e => {
      return ({
        type: 'link',
        href: `/${e.id.toLowerCase()}`,
        icon: e.linkIcon,
        name: formatMessage(e.name)
      })
    })
  )

  menuConfig.push(...[
    { type: 'spacer' },
    { type: 'link', href: '/settings', icon: ic_settings, name: formatMessage(messages.appMnuSettings) }
  ])

  return (
    <div style={[WindowStyle]}>
      <TitleBar platform={platform} title={formatMessage(messages.appTitle, { pkgname: appName, pkgversion: appVersion })}
                closeHandler={closeHandler} maximizeHandler={maximizeHandler} minimizeHandler={minimizeHandler} />
      <BrowserRouter>
        <MainLayout title={formatMessage(messages.appMnuTitle, { pkgname: appName })} menu={menuConfig}>
          <Switch>
            { extensions.map(e => {
                return (
                  <Route key={e.id} path={`/${e.id.toLowerCase()}`} component={e.mainView} />
                )
              })
            }
            <Route path='/settings' component={SettingsManager} />
            <Route path='/home' component={Home} />
            <Route render={() => {
              if (redirectTo === '/')
                return (<Home />)
              else
                return (<Redirect to={redirectTo} />)
              }
            } />
          </Switch>
        </MainLayout>
      </BrowserRouter>
    </div>
  )
}

export default injectIntl(Radium(Frame))
