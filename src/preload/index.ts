import {contextBridge, ipcRenderer} from 'electron'
import {electronAPI} from '@electron-toolkit/preload'
import {IProject} from '../renderer/src/store'

// Custom APIs for renderer
const api = {
    exportProject: (projects: IProject[]) => {
        ipcRenderer.send('export:project', projects)
    },
    importProject: async (): Promise<IProject[] | undefined | 'cancel'> => {
        return ipcRenderer.invoke('import:project')
    },
    loadLocalData: (): Promise<IProject[] | undefined> => {
        return ipcRenderer.invoke('load')
    },
    windowClose: (text: string) => {
        ipcRenderer.send('window:close', text)
    },
    windowMinimize: () => {
        ipcRenderer.send('window:minimize')
    },
    windowMaximize: () => {
        ipcRenderer.send('window:maximize')
    },
    windowIsMaximized: () => {
        return ipcRenderer.invoke('window:isMaximized')
    },
    platform: async (): Promise<string> => {
        return ipcRenderer.invoke('platform')
    },
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
