<script setup lang="ts">
import WindowTitlebar from '@/components/WindowTitlebar.vue'
import { useRoute } from 'vue-router'
import { testProjects } from '@/stores/service/project.service'

const route = useRoute()
testProjects()
</script>

<template>
  <window-titlebar />
  <router-view :key="route.fullPath" />
</template>

<style scoped></style>
