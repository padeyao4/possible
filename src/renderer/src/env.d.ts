/// <reference types="vite/client" />
/// <reference types="@types/uuid" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<NonNullable<unknown>, NonNullable<unknown>, never>
  export default component
}

import 'pinia'

declare module 'pinia' {
  export interface DefineStoreOptionsBase<S, Store> {
    // 允许为任何操作定义毫秒数
    debounce?: Partial<Record<keyof StoreActions<Store>, number>>
  }
  export interface PiniaCustomStateProperties<S> {
    $persist: () => void
    $hydrate: () => void
  }
}