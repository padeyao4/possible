<script setup lang="ts">
import TheSeparation from '@/components/common/TheSeparation.vue'
import TheAside from '@/components/IndexViewComponent/TheAside.vue'
import { updateProjects } from '@/service/project.service'
import { useSettings } from '@/stores/settings'
import { scheduleMidnightTask, useTimer } from '@/stores/timer'
import { tryOnBeforeMount, tryOnBeforeUnmount } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const settings = useSettings()

const sideWidth = computed(() => settings.sideWidth + 'px')
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
    <aside>
      <the-aside />
    </aside>
    <main>
      <router-view :key="route.fullPath" />
    </main>
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
  background-color: #f7f7f9;
}

aside {
  width: v-bind(sideWidth);
}

main {
  width: calc(100vw - v-bind(sideWidth));
  height: 100%;
  overflow: hidden;
  background-color: #fdfdfd;
  border-radius: 8px 0 0 0;
  box-shadow: rgba(0, 0, 0, 0.09) 0 0 4px;
}
</style>
