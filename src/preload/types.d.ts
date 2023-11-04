import {ElectronAPI} from '@electron-toolkit/preload'
import {IProject} from '../renderer/src/store'

declare global {
    export interface Window {
        electron: ElectronAPI
        api: {
            exportProject: (project: IProject[]) => void
            importProject: () => Promise<IProject[] | undefined | 'cancel'>
            loadLocalData: () => Promise<IProject[] | undefined>
            windowClose: (text: string) => void,
            windowMinimize: () => void,
            windowMaximize: () => void,
            windowIsMaximized: () => boolean,
            platform: () => Promise<string>
        }
    }
}
