import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import autoprefixer from 'autoprefixer';
import fs from 'node:fs';
import tailwindcss from 'tailwindcss';
import AutoImport from 'unplugin-auto-import/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';
import electron from 'vite-plugin-electron/simple';
import pkg from './package.json';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  fs.rmSync('dist-electron', { recursive: true, force: true });

  const isElectron = process.env.VITE_APP_TYPE === 'electron';
  const isServe = command === 'serve';
  const isBuild = command === 'build';
  const sourcemap = isServe || !!process.env.VSCODE_DEBUG;

  return {
    define: {
      'import.meta.env.VITE_APP_VERSION': JSON.stringify(pkg.version),
      'import.meta.env.VITE_APP_AUTHOR': JSON.stringify(pkg.author),
      'import.meta.env.VITE_APP_TYPE': JSON.stringify(process.env.VITE_APP_TYPE)
    },
    css: {
      postcss: {
        plugins: [tailwindcss(), autoprefixer()]
      }
    },
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      }),
      ...(isElectron ? [
        electron({
          main: {
            // Shortcut of `build.lib.entry`
          entry: 'electron/main/index.ts',
          onstart({ startup }) {
            if (process.env.VSCODE_DEBUG) {
              console.log(/* For `.vscode/.debug.script.mjs` */ '[startup] Electron App');
            } else {
              startup().then();
            }
          },
          vite: {
            build: {
              sourcemap,
              minify: isBuild,
              outDir: 'dist-electron/main',
              rollupOptions: {
                // Some third-party Node.js libraries may not be built correctly by Vite, especially `C/C++` addons,
                // we can use `external` to exclude them to ensure they work correctly.
                // Others need to put them in `dependencies` to ensure they are collected into `app.asar` after the app is built.
                // Of course, this is not absolute, just this way is relatively simple. :)
                external: Object.keys('dependencies' in pkg ? pkg.dependencies : {})
              }
            }
          }
        },
        preload: {
          // Shortcut of `build.rollupOptions.input`.
          // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
          input: 'electron/preload/index.ts',
          vite: {
            build: {
              sourcemap: sourcemap ? 'inline' : undefined, // #332
              minify: isBuild,
              outDir: 'dist-electron/preload',
              rollupOptions: {
                external: Object.keys('dependencies' in pkg ? pkg.dependencies : {})
              }
            }
          }
          },
          // Ployfill the Electron and Node.js API for Renderer process.
          // If you want use Node.js in Renderer process, the `nodeIntegration` needs to be enabled in the Main process.
          // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
          renderer: {}
        })]
    : [])
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server:
      process.env.VSCODE_DEBUG &&
      (() => {
        const url = new URL(pkg.debug.env.VITE_DEV_SERVER_URL);
        return {
          host: url.hostname,
          port: +url.port
        };
      })(),
    clearScreen: false,
    base: './',
    build: {
      chunkSizeWarningLimit: 10000
    }
  };
});