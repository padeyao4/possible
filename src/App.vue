<script setup lang="ts">
import { emitter } from '@/utils';
import { useAccount, useLayout } from '@/stores';
import { axiosConfig } from '@/core/config';
import LoginView from '@/views/LoginView.vue';
import { RouterView } from 'vue-router';
import { onBeforeUnmount, onMounted } from 'vue';
import { initApp } from '@/service';
import { useEventListener } from '@vueuse/core';

axiosConfig();
initApp();

const account = useAccount();
onMounted(() => {
  window.postMessage({ payload: 'removeLoading' }, '*');
});

onBeforeUnmount(() => {
  emitter.all.clear();
});

const layout = useLayout();

// 监听窗口大小变化
useEventListener('resize', () => {
  layout.resize();
});
</script>

<template>
  <router-view v-if="account.isAuth" />
  <login-view v-else />
</template>
