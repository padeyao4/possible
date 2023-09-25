import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      statePersist: (stateId, state) => number
      stateQuery: (stateId) => object | null
    }
  }
}
