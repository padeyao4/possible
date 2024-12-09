import { createPinia } from 'pinia'
import { createApp } from 'vue'
import './assets/main.css'
import App from './App.vue'
import router from './router'
import { piniaPersisted } from '@/plugin'
import { type ID, useGraph } from '@/stores'
import axios from 'axios'

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

export const errorCode = {
  ERR_NETWORK: '网络错误',
  ERR_BAD_REQUEST: '请求错误',
  ERR_UNAUTHORIZED: '未授权，请重新登录',
  ERR_NOT_FOUND: '请求地址出错',
  ERR_TIMEOUT: '请求超时',
  ERR_CONFLICT: '请求冲突',
  ERR_SERVER: '服务器出错'
};
axios.defaults.baseURL = import.meta.env.VITE_API_URL ?? '/';

axios.interceptors.request.use((config) => {
  config.headers['Authorization'] = `Bearer ${localStorage.getItem("token")}`;
  return config;
});

axios.interceptors.response.use(
  (resp) => resp,
  (error) => {
    return Promise.reject({
      ...error,
      message: error?.response?.data?.message ?? errorCode[error.code]
    });
  }
);