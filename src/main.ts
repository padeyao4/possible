import './assets/main.css';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import router from './router';
import { piniaPersisted } from '@/plugin';

const pinia = createPinia();
pinia.use(piniaPersisted);

const app = createApp(App);
app.use(ElementPlus, { zIndex: 3000 });
app.use(pinia);
app.use(router);
app.mount('#app');
