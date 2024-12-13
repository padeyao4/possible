import { createPinia } from 'pinia';
import { createApp } from 'vue';
import './assets/main.css';
import App from './App.vue';
import router from './router';
import { piniaPersisted } from '@/plugin';
import axios from 'axios';

const pinia = createPinia();
pinia.use(piniaPersisted);
const app = createApp(App);
app.use(pinia);
app.use(router);

app.mount('#app');
