<script setup lang="ts">
import TheAside from '@/components/TheAside.vue'
import { useRoute } from 'vue-router'
import { useSettings } from '@/stores/settings'
import TheSeparation from '@/components/TheSeparation.vue'
import { testProjects } from '@/stores/service/project-service'
import WindowTitlebar from '@/components/WindowTitlebar.vue'
import { computed, ref } from 'vue'

const route = useRoute()
const settings = useSettings()

testProjects()

const sideWidth = computed(() => {
  return settings.sideWidth + 'px'
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