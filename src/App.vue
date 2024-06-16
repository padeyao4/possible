<script setup lang="ts">
import GithubCorner from '@/components/other/GithubCorner.vue'
import { onMounted } from 'vue'
import useSyncService from './service/useSyncService'
import useLoadAccount from './service/useLoadAccount';
import useLoadProjects from './service/useLoadProjects';

useLoadAccount()
useLoadProjects()
useSyncService()

onMounted(() => {})
</script>

<template>
  <router-view :key="$route.fullPath" />
  <github-corner />
</template>

<style scoped></style>
