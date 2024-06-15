<script setup lang="ts">
import GithubCorner from '@/components/other/GithubCorner.vue'
import { onMounted } from 'vue'
import useSyncService from './service/useSyncService'
import useAccountService from './service/useAccountService';

useAccountService()
useSyncService()

onMounted(() => {})
</script>

<template>
  <router-view :key="$route.fullPath" />
  <github-corner />
</template>

<style scoped></style>
