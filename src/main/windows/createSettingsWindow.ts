import { join } from 'path'
import { BrowserWindow, ipcMain, shell } from 'electron'
import { is } from '@electron-toolkit/utils'
import { getIcon } from '../util'

export function createSettingsWindow(windowDict: Map<string, BrowserWindow>) {
  // Create the browser window.
  const settingsWindow = new BrowserWindow({
    width: 300,
    height: 400,
    show: false,
    title: 'settings',
    transparent: true,
    backgroundColor: '#00000000',
    autoHideMenuBar: true,
    frame: false,
    resizable: false,
    titleBarStyle: 'hidden',
    titleBarOverlay: false,
    ...getIcon(),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  settingsWindow.on('ready-to-show', () => {
    settingsWindow.show()
  })

  settingsWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url).then((r) => console.log(r))
    return { action: 'deny' }
  })

  // 关闭窗口
  ipcMain.on('window:settings:close', () => {
    windowDict.get('settings')?.close()
  })

  // 最小化窗口
  ipcMain.on('window:settings:minimize', () => {
    windowDict.get('settings')?.minimize()
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    settingsWindow
      .loadURL(process.env['ELECTRON_RENDERER_URL'] + '/settings')
      .then((r) => console.log(r))
  } else {
    settingsWindow
      .loadFile(join(__dirname, '../renderer/settings.html'))
      .then((r) => console.log(r))
  }
  windowDict.set('settings', settingsWindow)
}
