<script setup lang="ts">
import GithubCorner from '@/components/other/GithubCorner.vue';
import { useListenDataChange, useListenLogin, useLoadLocalData } from '@/service/client';
import emitter, { BusEvents } from '@/utils/emitter';

useLoadLocalData();
useListenLogin();
useListenDataChange();

emitter.on(BusEvents['account:login'], () => {
  // todo 账号成功后执行
});
</script>

<template>
  <router-view :key="$route.fullPath" />
  <github-corner />
</template>

<style scoped></style>
