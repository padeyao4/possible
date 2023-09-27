import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  export interface Window {
    electron: ElectronAPI
    api: {
      statePersist: (stateId: string, state: string) => Promise<number>
      stateQuery: (stateId: string) => Promise<object | null>
    }
  }
}
