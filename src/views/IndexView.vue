<script setup lang="ts">
import TheSide from '@/components/IndexViewComponent/TheSide.vue'
import TheSeparation from '@/components/common/TheSeparation.vue'
import { updateProjects } from '@/service/project.service'
import { useSettings } from '@/stores/settings'
import { scheduleMidnightTask, useTimer } from '@/stores/timer'
import { tryOnBeforeMount, tryOnBeforeUnmount } from '@vueuse/core'
import { computed, ref } from 'vue'

const settings = useSettings()

const width = computed(() => settings.sideWidth + 'px')
const clear = ref()
const timer = useTimer()

tryOnBeforeMount(() => {
  timer.update()
  updateProjects()
  scheduleMidnightTask(clear, () => {
    timer.update()
    updateProjects()
  })
})

tryOnBeforeUnmount(() => {
  clearTimeout(clear.value)
})
</script>

<template>
  <div class="container">
    <the-side class="side" />
    <router-view :key="$route.fullPath" class="main" />
    <the-separation />
  </div>
</template>

<style scoped>
.container {
  position: relative;
  display: flex;
  flex-direction: row;
  width: 100vw;
  height: 100vh;
  background-color: var(--background-bottom-color);
}

.side {
  width: v-bind(width);
}

.main {
  width: calc(100vw - v-bind(width));
  height: 100%;
  overflow: hidden;
  background-color: var(--background-middle-color);
  /* box-shadow: rgba(0, 0, 0, 0.09) 0 0 4px; */
  border-left: 1px solid #00000020;
  border-radius: 8px 0 0 0;
}
</style>
