<script setup lang="ts">
import WindowTitlebar from '@/components/other/WindowTitlebar.vue'
import GithubCorner from '@/components/other/GithubCorner.vue'
import { tryOnBeforeMount, useDebounceFn, useIntervalFn } from '@vueuse/core'
import { Store } from 'tauri-plugin-store-api'
import { useRoute } from 'vue-router'
import { useProjects } from './stores/projects'
import { isTauri } from './tauri-util'
import { invoke } from '@tauri-apps/api'

const projects = useProjects()
const route = useRoute()

tryOnBeforeMount(async () => {
  if (isTauri()) {
    const config: any = await invoke('read_config')
    const path = config.base_path + '/' + config.data_dir + '/db.dat'
    const db = new Store(path)
    projects.deserialize(await db.get('projects'))
    const debounceFn = useDebounceFn(async () => {
      await db.set('projects', projects.serialize())
      await db.save()
    }, 1000)
    projects.$subscribe(debounceFn)
  }
})

useIntervalFn(
  async () => {
    if (isTauri()) {
      const config: any = await invoke('read_config')
      if (config.git_enable && config.remote_enable) {
        await invoke('git_add_and_commit')
        await invoke('git_pull')
        await invoke('git_push')
      }
    }
  },
  1000 * 60 * 30
)
</script>

<template>
  <window-titlebar />
  <router-view :key="route.fullPath" />
  <github-corner />
</template>

<style scoped></style>
