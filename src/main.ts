import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'
import router from './router'
import { Icon } from '@iconify/vue'
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_BASE_PATH ?? '/'

const app = createApp(App)
app.use(createPinia())

app.use(router)
app.component('my-icon', Icon)

app.mount('#app')
