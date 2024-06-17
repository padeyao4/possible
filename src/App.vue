<script setup lang="ts">
import GithubCorner from '@/components/other/GithubCorner.vue';
import { onBeforeMount } from 'vue';
import useSyncService from './service/useSyncService';
import useLoadAccount from './service/useLoadAccount';
import useLoadProjects from './service/useLoadProjects';
import { useProjectStore } from '@/stores/project';

useLoadAccount();
useLoadProjects();
useSyncService();

onBeforeMount(() => {
  useProjectStore().faker();
});
</script>

<template>
  <router-view :key="$route.fullPath" />
  <github-corner />
</template>

<style scoped></style>
