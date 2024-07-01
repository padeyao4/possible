/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare global {
  interface Window {
    ipcRenderer: {
      send: (channel: string, ...args: any[]) => void;
      on: (channel: string, func: (...args: any[]) => void) => import('electron').IpcRenderer;
      off: (channel: string, func: (...args: any[]) => void) => import('electron').IpcRenderer;
      invoke: (channel: string, ...args: any[]) => Promise<any>;
    };
  }
}

export {};
