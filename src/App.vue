<script setup lang="ts">
import WindowTitlebar from '@/components/WindowTitlebar.vue'
import { tryOnBeforeMount } from '@vueuse/core'
import { Store } from 'tauri-plugin-store-api'
import { useRoute } from 'vue-router'
import { useProjects } from './stores/projects'
import { isTauri } from './tauri-util'

const projects = useProjects()
const route = useRoute()

tryOnBeforeMount(async () => {
  if (isTauri()) {
    const db = new Store(import.meta.env?.VITE_DATA_PATH ?? './test.db')
    projects.deserialize(await db.get('projects'))
    projects.$subscribe(async () => {
      await db.set('projects', projects.serialize())
      await db.save()
    })
  }
})
</script>

<template>
  <window-titlebar />
  <router-view :key="route.fullPath" />
</template>

<style scoped></style>
