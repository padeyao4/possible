import {electronApp, optimizer} from '@electron-toolkit/utils'
import {app, BrowserWindow, dialog, ipcMain} from 'electron'
import {join} from 'path'
import * as fs from 'fs'
import {createSettingsWindow} from "./windows/createSettingsWindow";
import {createMainWindow} from "./windows/createMainWindow";
import {updater} from "./ipc";
import {getPossibleHome, getUserHome} from "./util";

// close security warnings
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

;(function () {
    const POSSIBLE_HOME = getPossibleHome()
    if (!fs.existsSync(POSSIBLE_HOME)) {
        fs.mkdirSync(POSSIBLE_HOME)
    }
}())

/**
 * 窗口管理,keys:[main,settings]
 */
const windowDict = new Map<string, BrowserWindow>()

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
        ipcMain.on('export-data', (_, s: string) => {
            const USER_HOME = getUserHome()
            const exportPath = dialog.showSaveDialogSync({
                title: `导出`,
                defaultPath: `${USER_HOME}/Desktop/untitled.json`
            })
            if (exportPath !== undefined) {
                fs.writeFile(exportPath, s, (err) => {
                    console.error(err)
                })
            }
        })

        /**
         * 导入项目
         */
        ipcMain.handle('import-data', () => {
            const USER_HOME = getUserHome()
            const importPath = dialog.showOpenDialogSync({
                title: '导入项目',
                defaultPath: `${USER_HOME}/Desktop/`
            })
            if (importPath !== undefined) {
                console.log('import path', importPath)
                try {
                    return fs.readFileSync(importPath[0]).toString()
                } catch (e) {
                    console.error(e)
                }
            }
            return null
        })

        /**
         * 启动加载
         */
        ipcMain.handle('load-local-backup-data', () => {
            console.log(new Date(), 'load local data')
            try {
                let file = join(getPossibleHome(), 'data.json');
                if (fs.existsSync(file)) {
                    return fs.readFileSync(file).toString()
                }
            } catch (e) {
                console.error('write file failed', e)
            }
            return null
        })

        /**
         * 获取当前运行在的操作系统
         * darwin,linux,win32
         */
        ipcMain.handle('platform', () => {
            return process.platform
        })

        /**
         * 创建设置窗口
         */
        ipcMain.on('window:settings:create', () => {
            const settingsWindow = windowDict.get('settings')
            if (settingsWindow && !settingsWindow.isDestroyed()) {
                settingsWindow.show()
            } else {
                createSettingsWindow(windowDict)
            }
        })

        createMainWindow(windowDict)

        app.on('activate', function () {
            // On macOS, it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
            if (BrowserWindow.getAllWindows().length === 0) createMainWindow(windowDict)
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
updater()
