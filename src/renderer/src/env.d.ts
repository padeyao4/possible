/// <reference types="vite/client" />
/// <reference types="@types/uuid" />

import 'vue'
import 'pinia'

export interface ImportNetaEnv {
  readonly VITE_APP_TITLE: string
}

export interface ImportMeta {
  readonly env: ImportNetaEnv
}

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<NonNullable<unknown>, NonNullable<unknown>, never>
  export default component
}

declare module 'pinia' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export interface DefineStoreOptionsBase<S, Store> {
    // 允许为任何操作定义毫秒数
    debounce?: Partial<Record<keyof StoreActions<Store>, number>>
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export interface PiniaCustomStateProperties<S> {
    $persist: () => void
    $hydrate: () => void
  }
}
