<script setup lang="ts">
import GithubCorner from '@/components/other/GithubCorner.vue';
import { onMounted } from 'vue';

onMounted(() => {
})
</script>

<template>
  <router-view :key="$route.fullPath" />
  <github-corner />
</template>

<style scoped></style>
