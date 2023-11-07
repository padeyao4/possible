import './assets/main.css'
import {createApp} from 'vue'
import App from '@renderer/views/SettingsView.vue'
import router from './router'
import 'default-passive-events'
import ElementPlus from 'element-plus' // 必须在其他项导入之后
import 'element-plus/dist/index.css'

const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.mount('#app')
