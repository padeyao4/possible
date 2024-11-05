<script setup lang="ts">
import { useLayout } from '@/stores';
import { RouterView } from 'vue-router';
import { onMounted } from 'vue';
import { useEventListener } from '@vueuse/core';

onMounted(() => {
  window.postMessage({ payload: 'removeLoading' }, '*');
});

// 监听窗口大小变化
useEventListener('resize', () => {
  useLayout().resize();
});
</script>

<template>
  <router-view />
</template>
