<script setup lang="ts">
import GithubCorner from '@/components/other/GithubCorner.vue'
import WindowTitlebar from '@/components/other/WindowTitlebar.vue'
import { useProjects } from '@/stores/projects'
import { isTauri } from '@/tauri-util'
import { invoke } from '@tauri-apps/api'
import { tryOnBeforeMount, useDebounceFn, useIntervalFn } from '@vueuse/core'
import { testProjects } from './service/project.service'

// const { deserialize, serialize, $subscribe } = useProjects()

// tryOnBeforeMount(async () => {
//   if (isTauri()) {
//     const config: any = await invoke('read_config')
//     const path = config.base_path + '/' + config.data_dir + '/db.dat'
//     const db = new Store(path)
//     deserialize(await db.get('projects'))
//     const debounceFn = useDebounceFn(async () => {
//       await db.set('projects', serialize())
//       await db.save()
//     }, 1000)
//     $subscribe(debounceFn)
//   } else {
//     testProjects()
//   }
// })

// useIntervalFn(
//   async () => {
//     if (isTauri()) {
//       const config: any = await invoke('read_config')
//       if (config.git_enable && config.remote_enable) {
//         await invoke('git_add_and_commit')
//         await invoke('git_pull')
//         await invoke('git_push')
//       }
//     }
//   },
//   1000 * 60 * 30
// )
</script>

<template>
  <window-titlebar />
  <router-view :key="$route.fullPath" />
  <github-corner />
</template>

<style scoped></style>
