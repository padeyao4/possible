import { BrowserWindow, globalShortcut, ipcMain, shell } from 'electron'
import { getIcon, getPossibleHome } from '../util'
import { join } from 'path'
import fs from 'fs'
import { is } from '@electron-toolkit/utils'

export function createMainWindow(windowDict: Map<string, BrowserWindow>): void {
  const mainWindow = new BrowserWindow({
    width: 1200,
    minWidth: 1000,
    height: 800,
    minHeight: 600,
    show: false,
    title: 'possible',
    transparent: true,
    backgroundColor: '#00000000',
    autoHideMenuBar: true,
    frame: false,
    titleBarStyle: 'hidden',
    titleBarOverlay: false,
    ...getIcon(),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  globalShortcut.register('CommandOrControl+Shift+i', function () {
    mainWindow.webContents.openDevTools()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url).then((r) => console.log(r))
    return { action: 'deny' }
  })

  // 关闭窗口
  ipcMain.on('window:main:close', () => {
    windowDict.get('main')?.hide()
  })

  ipcMain.on('project-save', (_, text: string) => {
    const possibleHome = getPossibleHome()
    const file = join(possibleHome, 'data.json')
    if (fs.existsSync(file)) {
      const backupFile = Math.floor(new Date().getTime() / 1000)
      fs.copyFileSync(file, join(possibleHome, backupFile.toString()))
    }
    fs.writeFileSync(file, text)
  })

  // 最小化窗口
  ipcMain.on('window:main:minimize', () => {
    mainWindow.minimize()
  })

  //最大化窗口
  ipcMain.on('window:main:maximize', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow.maximize()
    }
  })

  ipcMain.handle('window:isMaximized', () => {
    return mainWindow.isMaximized()
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']).then((r) => console.log(r))
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html')).then((r) => console.log(r))
  }
  windowDict.set('main', mainWindow)
}
