<script setup lang="ts">
import TheAside from '@/components/TheAside.vue'
import TheSeparation from '@/components/TheSeparation.vue'
import WindowTitlebar from '@/components/WindowTitlebar.vue'
import { syncProjects, testProjects } from '@/stores/service/project.service'
import { useSettings } from '@/stores/settings'
import { tryOnBeforeMount, tryOnBeforeUnmount } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { scheduleMidnightTask, useTimer } from './stores/timer'

const route = useRoute()
const settings = useSettings()
testProjects()
const sideWidth = computed(() => settings.sideWidth + 'px')
const clear = ref()
const timer = useTimer()

tryOnBeforeMount(() => {
  timer.update()
  syncProjects()
  scheduleMidnightTask(clear, () => {
    timer.update()
    syncProjects()
  })
})

tryOnBeforeUnmount(() => {
  clearTimeout(clear.value)
})
</script>

<template>
  <window-titlebar />
  <div class="container">
    <aside>
      <the-aside />
    </aside>
    <main>
      <router-view :key="route.fullPath" />
    </main>
    <the-separation class="separation-line" />
  </div>
</template>

<style scoped>
.container {
  display: flex;
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #f7f7f9;
  flex-direction: row;
}

aside {
  width: v-bind(sideWidth);
}

main {
  width: calc(100vw - v-bind(sideWidth));
  height: 100%;
  border-radius: 8px 0 0 0;
  box-shadow: rgba(0, 0, 0, 0.09) 0 0 4px;
  background-color: #fdfdfd;
  overflow: hidden;
}

.separation-line {
  position: absolute;
  left: v-bind(sideWidth);
  top: 0;
  bottom: 0;
  width: 5px;
}
</style>
