<script setup lang="ts">
import GithubCorner from '@/components/other/GithubCorner.vue'
import { onMounted } from 'vue'
import { testProjects } from './service/project.service'

onMounted(() => {
  testProjects()
})
</script>

<template>
  <router-view :key="$route.fullPath" />
  <github-corner />
</template>

<style scoped></style>
