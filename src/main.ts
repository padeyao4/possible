import 'default-passive-events'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'
import router from './router'
import './utils/browser-patch'
import log from 'loglevel'

log.setDefaultLevel(import.meta.env.DEV ? 'trace' : 'silent')

const app = createApp(App)
app.use(ElementPlus)
app.use(createPinia())

app.use(router)

app.mount('#app')