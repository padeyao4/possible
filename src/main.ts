import { createPinia } from 'pinia';
import { createApp } from 'vue';
import './assets/main.css';
import App from './App.vue';
import router from './router';
import { piniaPersisted } from '@/plugin';
import { type ID, useGraph } from '@/stores';

const pinia = createPinia();
pinia.use(piniaPersisted);
const app = createApp(App);
app.use(pinia);
app.use(router);
// 页面每次跳转前记录跳转后的项目id
router.beforeEach(async (to, from, next) => {
  const graph = useGraph();
  if (to.name === 'project') {
    graph.setProjectId(<ID>to.query['id']);
    if (!graph.project) {
      // 当项目id不存在时，跳转到today页面
      await router.push({ name: 'today' });
    }
  }
  next();
});
app.mount('#app');
