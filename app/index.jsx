// @flow

import { app, BrowserWindow, Tray } from 'electron'

import cp from 'child_process'
import path from 'path'
import os from 'os'
import username from 'username'

import electronDebug from 'electron-debug'

let mainWindow, trayIcon

/**
 * [onClosed description]
 * @return [type] [description]
 */
const onClosed = () => {
  // deref the window
  // for multiple windows store them in an array
  mainWindow = null
}

/**
 * [onCrash description]
 * @param  {[type]} err [description]
 * @return [type]       [description]
 */
const onCrash = (err) => {
  console.log(err)
}

/**
 * [createMainWindow description]
 * @type {[type]}
 */
const createMainWindow = () => {

  let win = new BrowserWindow({
    width: 1280,
    height: 800,
    frame: false
  })

  win.loadURL('file://' + __dirname + '/main.html')
  win.on('closed', onClosed)
  win.webContents.on('crashed', onCrash)
  win.on('unresponsive', onCrash)

  return win
}

/**
 * [isInstallRequest description]
 * @return Boolean [description]
 */
const isInstallRequest = (args:Array<string>) => {

  if (process.platform !== 'win32') {
    return false
  }

  let updateDotExe = path.resolve(path.dirname(process.execPath), '..', 'update.exe')
  let target = path.basename(process.execPath)

  let squirrelCommand = args[1]
  switch (squirrelCommand) {
    case '--squirrel-install':
    case '--squirrel-updated':

      // Optionally do things such as:
      //
      // - Install desktop and start menu shortcuts
      // - Add your .exe to the PATH
      // - Write to the registry for things like file associations and
      //   explorer context menus

      // create shortcuts
      cp.spawnSync(updateDotExe, ['--createShortcut', target], {
        detached: true
      })

      // Always quit when done
      app.quit()
      return true

    case '--squirrel-uninstall':
      // Undo anything you did in the --squirrel-install and
      // --squirrel-updated handlers

      cp.spawnSync(updateDotExe, ['--removeShortcut', target], {
        detached: true
      })

      // Always quit when done
      app.quit()
      return true

    case '--squirrel-obsolete':
      // This is called on the outgoing version of your app before
      // we update to the new version - it's the opposite of
      // --squirrel-updated
      app.quit()
      return true
  }
}

/**
 * [startup description]
 * @return [type] [description]
 */
const startup = (args:Array<string>) => {

  // adds debug features like hotkeys for triggering dev tools and reload
  let debugOptions = {}

  if (process.env.DEBUG === "1") {
    debugOptions = { enabled: true, showDevTools: 'bottom' }
    electronDebug(debugOptions)
  }

  // check if we are being called by installer routine
  if (isInstallRequest(args)) return;

  /**
   *
   */
  app.on('activate', function() {
    if (!mainWindow) {
      mainWindow = createMainWindow()
    }
  })

  /**
   *
   */
  app.on('ready', function() {
    if (!mainWindow) {
      mainWindow = createMainWindow()
    }
    if (process.env.DEBUG === "1") {
      const electronDevTools = require('electron-devtools-installer')
      electronDevTools.default(electronDevTools.REACT_DEVELOPER_TOOLS)
      .then((name) => {
        console.log(`Added Extension:  ${name}`)
      })
    }
  })

  /**
   *
   *
   * @returns
   */
  app.sysConfig = function() {

    const appName = app.getName()
    const appVersion = app.getVersion()
    const appPath = app.getAppPath()
    const dataDir = `${app.getPath('userData')}${path.sep}`
    const tempDir = `${app.getPath('temp')}${path.sep}`
    const homeDir = `${app.getPath('home')}${path.sep}`
    const platform = os.platform()
    const hostname = os.hostname()
    const user = username.sync()
    const defaultLocale = app.getLocale()

    return {
      app: {
        name: appName,
        version: appVersion
      },
      host: hostname,
      platform: platform,
      defaultLocale: defaultLocale,
      user: user,
      paths: {
        appPath: appPath,
        home: homeDir,
        temp: tempDir,
        data: dataDir
      }
    }
  }

  /**
   *
   *
   * @returns
   */
  app.getMainWindow = function() {
    return mainWindow
  }

  /**
   *
   */
  app.close = function() {
    if (mainWindow) {
      mainWindow.close()
    }
    app.quit()
  }

  /**
   *
   */
  app.toggleFullscreen = function() {
    if (mainWindow) {
      mainWindow.setFullScreen(!mainWindow.isFullScreen())
    }
  }

  /**
   *
   */
  app.minimizeAppToSysTray = function() {
    trayIcon = new Tray(path.join(__dirname, 'assets', 'boilerplate_tray.png'))
    trayIcon.setToolTip('App is running in background mode.')
    trayIcon.on('click', () => {
      if (mainWindow) {
        mainWindow.show()
        trayIcon.destroy()
      }
    })
    if (mainWindow) {
      mainWindow.hide()
    }
  }
}

startup(process.argv)
