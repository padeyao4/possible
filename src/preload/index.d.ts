import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      projectSave: () => void
      testQuery: (content) => Date
      statePersist: (stateId, state) => number
      stateQuery: (stateId) => object | null
    }
  }
}
