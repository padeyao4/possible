/// <reference types="vite/client" />
/// <reference types="@vue-macros/reactivity-transform/macros-global" />

interface ImportMeta {
    readonly env: ImportMetaEnv
}

interface ImportMetaEnv {
    readonly url: string
}