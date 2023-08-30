import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import VueMacros from 'unplugin-vue-macros/vite'
import Vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/

export default defineConfig({
    plugins: [
        VueMacros({
            plugins: {
                vue: Vue(),
            },
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
})
