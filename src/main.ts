import './assets/main.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import 'default-passive-events'
import './utils/browser-patch'

const app = createApp(App)

app.use(ElementPlus)

app.use(createPinia().use(createPersistedState({
    storage: sessionStorage,
    serializer: {
        serialize: (value) => {
            console.log('serialize', value)
            return JSON.stringify(value)
        },
        deserialize: (value) => JSON.parse(value)
    }
})))

app.use(router)

app.mount('#app')
