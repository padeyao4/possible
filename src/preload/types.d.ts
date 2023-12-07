import {ElectronAPI} from '@electron-toolkit/preload'
import {UpdateCheckResult} from "electron-updater";

declare global {
  export interface Window {
    electron: ElectronAPI
    api: {
      exportData: (s: string) => void
      importData: () => Promise<string | null>
      loadLocalData: () => Promise<string | null>,
      saveData: (text: string) => void,
      windowMainClose: () => void,
      windowMainMinimize: () => void,
      windowMainMaximize: () => void,
      windowIsMaximized: () => boolean,
      createSettingsWindow: () => void,
      windowSettingsMinimize: () => void,
      windowSettingsClose: () => void,
      platform: () => Promise<string>
      possibleVersion: () => Promise<string>,
      checkForUpdates: () => Promise<UpdateCheckResult | null>
    }
  }
}
