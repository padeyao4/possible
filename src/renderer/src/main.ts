import './assets/main.css'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPersistent } from './util/persister'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

const pinia = createPinia()
pinia.use(createPersistent())

app.use(pinia)
app.use(ElementPlus)
app.use(router)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
