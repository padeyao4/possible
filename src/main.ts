import './assets/main.css';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import router from './router';
import { piniaPersisted } from '@/plugin';
import { type ID, useGraph } from '@/stores';

const pinia = createPinia();
pinia.use(piniaPersisted);
const app = createApp(App);
app.use(ElementPlus, { zIndex: 3000 });
app.use(pinia);
app.use(router);
// 页面每次跳转前记录跳转后的项目id
router.beforeEach(async (to, from, next) => {
  const graph = useGraph();
  to.name === 'project' && graph.setCurrentId(to.query['id'] as ID);
  next();
});
app.mount('#app');
