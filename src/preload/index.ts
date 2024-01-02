import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { UpdateCheckResult } from 'electron-updater'

// Custom APIs for renderer
const api = {
  exportData: (s: string) => {
    ipcRenderer.send('export-data', s)
  },
  openFile: async (): Promise<string | null> => {
    return ipcRenderer.invoke('import-data')
  },
  loadLocalData: (): Promise<string | null> => {
    return ipcRenderer.invoke('load-local-backup-data')
  },
  saveData: (text: string) => {
    ipcRenderer.send('project-save', text)
  },
  windowMainClose: () => {
    ipcRenderer.send('window:main:close')
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
  possibleVersion: (): Promise<string> => {
    return ipcRenderer.invoke('possible-version')
  },
  platform: async (): Promise<string> => {
    return ipcRenderer.invoke('platform')
  },
  checkForUpdates(): Promise<UpdateCheckResult | null> {
    return ipcRenderer.invoke('check-for-update')
  },
  isDev: async (): Promise<boolean> => {
    return ipcRenderer.invoke('is-dev')
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
