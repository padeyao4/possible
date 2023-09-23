import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  projectSave: () => {
    ipcRenderer.send('project:save')
  },
  testQuery: (content) => {
    return ipcRenderer.invoke('test:query', 'ipcRender' + new Date(), 'web' + content)
  },
  statePersist: (stateId, state) => {
    return ipcRenderer.invoke('state:persist', stateId, state)
  },
  stateQuery: (stateId) => {
    return ipcRenderer.invoke('state:query', stateId)
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