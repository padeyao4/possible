import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/

import ReactivityTransform from '@vue-macros/reactivity-transform/vite'

export default defineConfig({
    plugins: [
        vue(),
        ReactivityTransform()
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
})
