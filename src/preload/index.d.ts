import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  export interface Window {
    electron: ElectronAPI
    api: {
      statePersist: (stateId, state) => number
      stateQuery: (stateId) => object | null
    }
  }
}
