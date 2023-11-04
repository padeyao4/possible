import './assets/main.css'
import '@renderer/assets/iconfont/iconfont'
import '@renderer/g6'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import {createPinia} from 'pinia'
import {createApp} from 'vue'
import App from './App.vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import router from './router'
import 'default-passive-events'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(ElementPlus)

app.use(router)

app.mount('#app')
