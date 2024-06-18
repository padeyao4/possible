import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import './assets/main.css';
import router from './router';
import piniaPluginPersistence from 'pinia-plugin-persistedstate';
import { axiosConfig } from '@/core/config';

const app = createApp(App);
app.use(createPinia().use(piniaPluginPersistence));
app.use(router);
app.mount('#app');
axiosConfig();
