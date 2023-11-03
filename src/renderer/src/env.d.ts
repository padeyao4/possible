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
