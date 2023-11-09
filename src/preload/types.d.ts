import {ElectronAPI} from '@electron-toolkit/preload'

declare global {
    export interface Window {
        electron: ElectronAPI
        api: {
            exportData: (s: string) => void
            importData: () => Promise<string | null>
            loadLocalData: () => Promise<string | null>
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
