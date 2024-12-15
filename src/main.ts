import { piniaPersisted } from '@/plugin';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './assets/main.css';
import router from './router';

const pinia = createPinia();
pinia.use(piniaPersisted);
const app = createApp(App);
app.use(pinia);
app.use(router);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.mount('#app');
