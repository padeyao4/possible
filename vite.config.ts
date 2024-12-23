import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import vue from '@vitejs/plugin-vue';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';
import pkg from './package.json';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isElectron = mode === 'production' || mode === 'development';
  
  return {
    define: {
      'import.meta.env.VITE_APP_VERSION': JSON.stringify(pkg.version),
      'import.meta.env.VITE_APP_AUTHOR': JSON.stringify(pkg.author)
    },
    css: {
      postcss: {
        plugins: [
          tailwindcss(),
          autoprefixer(),
        ],
      },
    },
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      }),
      ...(isElectron 
        ? [
            electron([
              {
                entry: 'electron/main/index.ts',
                vite: {
                  build: {
                    outDir: 'dist-electron/main'
                  }
                }
              },
              {
                entry: 'electron/preload/index.ts',
                vite: {
                  build: {
                    outDir: 'dist-electron/preload'
                  }
                }
              }
            ]),
            renderer()
          ] 
        : []
      )
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    clearScreen: false,
    base: env.BASE_URL || '/',
    build: {
      chunkSizeWarningLimit: 10000,
      outDir: isElectron ? 'dist-electron' : 'dist'
    },
    electron: {
      outDir: 'dist-electron',
      entry: 'electron/main/index.ts',
      renderer: 'electron/renderer/index.ts',
    }
  }
});
