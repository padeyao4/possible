<script setup lang="ts">
import { emitter } from '@/utils';
import { useAccount } from '@/stores';
import { axiosConfig } from '@/core/config';
import LoginView from '@/views/LoginView.vue';
import { RouterView } from 'vue-router';
import { onBeforeUnmount, onMounted } from 'vue';
import { initApp } from '@/service';

axiosConfig();
initApp();

const account = useAccount();
onMounted(() => {
  window.postMessage({ payload: 'removeLoading' }, '*');
});

onBeforeUnmount(() => {
  emitter.all.clear();
});
</script>

<template>
  <router-view v-if="account.isAuth" />
  <login-view v-else />
</template>
