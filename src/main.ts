import { piniaPersisted } from '@/plugin';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './assets/main.css';
import router from './router';
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/el-message.css';
import 'element-plus/theme-chalk/el-message-box.css';
import 'element-plus/theme-chalk/el-notification.css';

const pinia = createPinia();
pinia.use(piniaPersisted);
const app = createApp(App);
app.use(pinia);
app.use(router);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.mount('#app');
