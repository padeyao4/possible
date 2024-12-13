<script lang="ts" setup>
import router from '@/router';
import { useAccountStore, useDataStore } from '@/stores';
import axios from 'axios';
import { RouterView } from 'vue-router';
import { ErrorCode } from './utils';
import { watchEffect } from 'vue';

const dataStore = useDataStore();
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
    return Promise.reject({
      ...error,
      message: error?.response?.data?.message ?? ErrorCode[error.code]
    });
  }
);

// 页面每次跳转前记录跳转后的项目id
router.beforeEach(async (to, from, next) => {
  // 没有token时跳转到登录页面
  if (!accountStore.token && to.name !== 'login') {
    return next({ name: 'login' });
  }

  // 当跳转到project页面时，设置项目id
  if (to.name === 'project') {
    const id = to.query['id'] as string;
    dataStore.setProjectId(id);
    // 当项目id不存在时，跳转到today页面
    if (!dataStore.projectsMap.has(id)) {
      return next({ name: 'today' });
    }
  }

  next();
});
</script>

<template>
  <router-view />
</template>
