import {contextBridge, ipcRenderer} from 'electron'
import {electronAPI} from '@electron-toolkit/preload'
import {IProject} from '../renderer/src/store'

// Custom APIs for renderer
const api = {
    exportProject: (s: string) => {
        ipcRenderer.send('export:project', s)
    },
    importProject: async (): Promise<IProject[] | undefined | 'cancel'> => {
        return ipcRenderer.invoke('import:project')
    },
    loadLocalData: (): Promise<IProject[] | undefined> => {
        return ipcRenderer.invoke('load')
    },
    windowMainClose: (text: string) => {
        ipcRenderer.send('window:main:close', text)
    },
    windowMainMinimize: () => {
        ipcRenderer.send('window:main:minimize')
    },
    windowMainMaximize: () => {
        ipcRenderer.send('window:main:maximize')
    },
    windowIsMaximized: () => {
        return ipcRenderer.invoke('window:isMaximized')
    },
    createSettingsWindow: () => {
        ipcRenderer.send('window:settings:create')
    },
    windowSettingsMinimize: () => {
        ipcRenderer.send('window:settings:minimize')
    },
    windowSettingsClose: () => {
        ipcRenderer.send('window:settings:close')
    },
    platform: async (): Promise<string> => {
        return ipcRenderer.invoke('platform')
    }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld('electron', electronAPI)
        contextBridge.exposeInMainWorld('api', api)
    } catch (error) {
        console.error(error)
    }
} else {
    // @ts-ignore (define in dts)
    window.electron = electronAPI
    // @ts-ignore (define in dts)
    window.api = api
}
