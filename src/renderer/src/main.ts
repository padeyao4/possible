import './assets/main.css'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPersister } from './util/persister'

const app = createApp(App)

const pinia = createPinia()
pinia.use(createPersister())

app.use(pinia)
app.use(ElementPlus)
app.use(router)
app.mount('#app')
