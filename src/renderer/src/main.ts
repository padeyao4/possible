import 'reflect-metadata'
import './assets/main.css'
import '@renderer/g6'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'default-passive-events'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@renderer/util/browser-patch'
import { initEnv, loads } from '@renderer/util/data'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(ElementPlus)
app.use(router)
app.mount('#app')
;(async function () {
  await initEnv()
  await loads()
})()
  .then((data) => console.log(data))
  .catch((r) => console.error(r))
