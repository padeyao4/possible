import './assets/main.css'
import '@renderer/g6'
import {createPinia} from 'pinia'
import {createApp} from 'vue'
import App from './App.vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import router from './router'
import 'default-passive-events'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@renderer/util/browser-patch'
import {loads} from "@renderer/util/data";

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(ElementPlus)
app.use(router)
app.mount('#app')

;(async function () {
    loads(await window.api.loadLocalData())
  }()
)
