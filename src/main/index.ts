import {electronApp, is, optimizer} from '@electron-toolkit/utils'
import {app, BrowserWindow, dialog, ipcMain, shell} from 'electron'
import {join} from 'path'
import icon from '../../resources/icon.png?asset'
import {IProject} from '../renderer/src/store'
import * as fs from 'fs'

// close security warnings
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'
// 获取用户home目录
const USER_HOME = process.env.HOME || process.env.USERPROFILE || '~/'

// 检查possible_home变量是否存在
const POSSIBLE_HOME = process.env.POSSIBLE_HOME || join(USER_HOME, '.possible')

if (!fs.existsSync(POSSIBLE_HOME)) {
    fs.mkdirSync(POSSIBLE_HOME)
}

let mainWindow: BrowserWindow

function createWindow(): void {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1440,
        minWidth: 900,
        height: 900,
        minHeight: 600,
        show: false,
        title: 'possible',
        transparent: true,
        backgroundColor: '#00000000',
        autoHideMenuBar: true,
        frame: false,
        titleBarStyle: 'hidden',
        titleBarOverlay: false,
        ...(process.platform === 'linux' ? {icon} : {}),
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
        return {action: 'deny'}
    })

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']).then((r) => console.log(r))
    } else {
        mainWindow.loadFile(join(__dirname, '../renderer/index.html')).then((r) => console.log(r))
    }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app
    .whenReady()
    .then(async () => {
        // setTray()

        // Set app user model id for windows
        electronApp.setAppUserModelId('com.electron')

        // Default open or close DevTools by F12 in development
        // and ignore CommandOrControl + R in production.
        // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
        app.on('browser-window-created', (_, window) => {
            optimizer.watchWindowShortcuts(window)
        })

        /**
         * 导出项目
         */
        ipcMain.on('export:project', (_, projects: IProject[]) => {
            const fileName = projects.length === 1 ? `${projects[0].name}` : 'untitled'
            const exportPath = dialog.showSaveDialogSync({
                title: `导出${fileName}`,
                defaultPath: `${USER_HOME}/Desktop/${fileName}.json`
            })
            if (exportPath !== undefined) {
                fs.writeFile(exportPath, JSON.stringify(projects), (err) => {
                    console.error(err)
                })
            }
        })

        /**
         * 导入项目
         */
        ipcMain.handle('import:project', () => {
            const importPath = dialog.showOpenDialogSync({
                title: '导入项目',
                defaultPath: `${USER_HOME}/Desktop/`
            })
            if (importPath !== undefined) {
                console.log('import path', importPath)
                try {
                    const data = fs.readFileSync(importPath[0]).toString()
                    // todo 校验数据是否符合IProject
                    return JSON.parse(data)
                } catch (e) {
                    console.error(e)
                }
            } else {
                return 'cancel'
            }
        })

        ipcMain.handle('load', () => {
            console.log(new Date(), 'load local data')
            try {
                let file = join(POSSIBLE_HOME, 'data.json');
                if (fs.existsSync(file)) {
                    return JSON.parse(fs.readFileSync(file).toString())
                }
            } catch (e) {
                console.error('write file failed', e)
            }
        })

        /**
         * 获取当前运行在的操作系统
         */
        ipcMain.handle('platform', () => {
            if (process.platform == 'darwin') {
                return 'macOs'
            }
            if (process.platform == 'win32') {
                return 'windows'
            }
            if (process.platform == 'linux') {
                return 'linux'
            }
            return process.platform
        })

        // 关闭窗口
        ipcMain.on('window:close', (_, text: string) => {
            try {
                let file = join(POSSIBLE_HOME, 'data.json');
                if (fs.existsSync(file)) {
                    // todo 保存半年的文件
                    const backupFile = Math.floor(new Date().getTime() / 1000)
                    fs.copyFileSync(file, join(POSSIBLE_HOME, backupFile.toString()))
                }
                fs.writeFileSync(file, text)
            } catch (e) {
                console.error('write file failed', e)
            } finally {
                mainWindow.close();
            }
        });

        // 最小化窗口
        ipcMain.on('window:minimize', () => {
            mainWindow.minimize();
        });

        //最大化窗口
        ipcMain.on('window:maximize', () => {
            if (mainWindow.isMaximized()) {
                mainWindow.unmaximize();
            } else {
                mainWindow.maximize();
            }
        })

        ipcMain.handle('window:isMaximized', () => {
            return mainWindow.isMaximized()
        })

        createWindow()

        app.on('activate', function () {
            // On macOS, it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
            if (BrowserWindow.getAllWindows().length === 0) createWindow()
        })
    })
    .catch((reason) => {
        console.log('reason', reason)
    })

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
