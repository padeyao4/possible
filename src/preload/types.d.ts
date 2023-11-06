import {ElectronAPI} from '@electron-toolkit/preload'
import {IProject} from '../renderer/src/store'

declare global {
    export interface Window {
        electron: ElectronAPI
        api: {
            exportProject: (s: string) => void
            importProject: () => Promise<IProject[] | undefined | 'cancel'>
            loadLocalData: () => Promise<IProject[] | undefined>
            windowMainClose: (text: string) => void,
            windowMainMinimize: () => void,
            windowMainMaximize: () => void,
            windowIsMaximized: () => boolean,
            createSettingsWindow: () => void,
            windowSettingsMinimize: () => void,
            windowSettingsClose: () => void,
            platform: () => Promise<string>
        }
    }
}
