import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { PrismaClient } from '@prisma/client'
import { BrowserWindow, Menu, Tray, app, ipcMain, shell } from 'electron'
import { join } from 'path'
import icon from '../../resources/icon.png?asset'

const prisma = new PrismaClient()

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    show: false,
    title: 'possible',
    transparent: true,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url).then((r) => console.log(r))
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']).then((r) => console.log(r))
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html')).then((r) => console.log(r))
  }
}

/**
 * 创建托盘
 */
function setTray() {
  const tray = new Tray(join(__dirname, '../../resources/tray.png'))
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Item1', type: 'radio' },
    { label: 'Item2', type: 'radio' },
    { label: 'Item3', type: 'radio', checked: true },
    { label: 'Item4', type: 'radio' }
  ])

  tray.setContextMenu(contextMenu)
  tray.setToolTip('This is my application')
  tray.setTitle('This is my title')
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app
  .whenReady()
  .then(async () => {
    setTray()

    // Set app user model id for windows
    electronApp.setAppUserModelId('com.electron')

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    ipcMain.on('project:save', () => {
      console.log('project:save')
    })
    ipcMain.handle('test:query', (_, arg1, arg2) => {
      console.log('test:query', arg1, arg2)
      return new Date()
    })

    // 查询状态表中最新的数据
    ipcMain.handle('state:query', async (_, stateId) => {
      const storeItem = await prisma.store.findFirst({
        where: {
          stateId
        },
        orderBy: {
          createdTime: 'desc'
        }
      })
      return JSON.parse(storeItem?.state ?? 'null')
    })

    // 存储pinia状态
    ipcMain.handle('state:persist', async (_, stateId, state: string) => {
      console.log('persist', new Date())
      const newStore = await prisma.store.create({
        data: {
          stateId,
          createdTime: new Date(),
          state
        }
      })
      return newStore.id
    })

    createWindow()

    app.on('activate', function () {
      // On macOS, it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })
  .catch((reson) => {
    console.log('reson', reson)
    prisma.$disconnect()
  })

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  prisma.$disconnect()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
