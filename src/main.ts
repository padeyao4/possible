import 'default-passive-events'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'
import router from './router'
import './utils/browser-patch'

const app = createApp(App)
app.use(ElementPlus)
app.use(createPinia().use(createPersistedState()))
app.use(router)

app.mount('#app')