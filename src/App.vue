<script lang="ts" setup>
import axios from 'axios';
import { watchEffect } from 'vue';
import { RouterView } from 'vue-router';
import router from './router';
import { useAccountStore, usePlanStore } from './stores';
import { ErrorCode } from './utils';
import { ElMessageBox, ElNotification } from 'element-plus';
const planStore = usePlanStore();
const accountStore = useAccountStore();

axios.defaults.baseURL = import.meta.env.VITE_API_URL ?? '/';

watchEffect(() => {
  axios.interceptors.request.use((config) => {
    config.headers['Authorization'] = `Bearer ${accountStore.token}`;
    return config;
  });
});

axios.interceptors.response.use(
  (resp) => resp,
  (error) => {
    const errorMessage = error?.response?.data?.message ?? ErrorCode[error.code] ?? '未知错误';
    
    // 处理特定的错误状态码
    if (error.response) {
      switch (error.response.status) {
        case 401:
          ElMessageBox.alert('您的登录状态已失效，请重新登录', '登录状态', {
            confirmButtonText: '确定',
            showClose: false,
            callback: () => {
              accountStore.logout();
            },
            type: 'error'
          });
          break;
        case 403:
          ElNotification.error({
            title: '权限错误',
            message: errorMessage,
            duration: 3000
          });
          break;
        case 500:
          ElNotification.error({
            title: '服务器错误',
            message: errorMessage,
            duration: 3000
          });
          break;
      }
    }

    return Promise.reject({
      ...error,
      message: errorMessage
    });
  }
);

// 页面每次跳转前记录跳转后的项目id
router.beforeEach(async (to, from, next) => {
  // 没有token时跳转到登录页面
  if ((!accountStore.token) && to.name !== 'login') {
    return next({ name: 'login' });
  }

  // 当跳转到project页面时，设置项目id
  if (to.name === 'project') {
    const id = to.query['id'] as string;
    planStore.setProjectId(id);
    if (!planStore.projectsList.includes(id)) {
      return next({ name: 'today' });
    }
  }
  next();
});

window.postMessage({ payload: 'removeLoading' }, '*');

</script>

<template>
  <router-view />
</template>
