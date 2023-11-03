import {ElectronAPI} from '@electron-toolkit/preload'
import {IProject} from '../renderer/src/store'

declare global {
  export interface Window {
    electron: ElectronAPI
    api: {
      exportProject: (project: IProject[]) => void
      importProject: () => Promise<IProject[] | undefined | 'cancel'>
      windowClose: () => void,
      windowMinimize: () => void,
      windowMaximize: () => void,
      platform: () => Promise<string>
    }
  }
}
