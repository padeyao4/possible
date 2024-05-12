<script setup lang="ts">
import TheAside from '@/components/TheAside.vue'
import { useRoute } from 'vue-router'
import { useSettings } from '@/stores/settings'
import TheSeparation from '@/components/TheSeparation.vue'
import { testProjects } from '@/stores/service/project-service'
import WindowTitlebar from '@/components/WindowTitlebar.vue'

const route = useRoute()
const settings = useSettings()

testProjects()

</script>

<template>
  <window-titlebar />
  <div id="main">
    <div id="aside" :style="{'width':`${settings.sideWidth}px`}">
      <the-aside />
    </div>
    <div id="container" :style="{'width': `calc(100vw - ${settings.sideWidth}px)`}">
      <router-view :key="route.fullPath" style="height: 100%" />
    </div>
    <the-separation :style="{'left':`${settings.sideWidth}px`}" />
  </div>
</template>

<style scoped>

#main {
  position: relative;
  display: flex;
  flex-direction: row;
  width: 100vw;
  height: 100vh;
  background-color: #f7f7f9;
}

#aside {
  flex-shrink: 0;
}

#container {
  width: 100%;
  height: 100%;
  border-radius: 8px 0 0 0;
  background-color: #fdfdfd;
  box-shadow: rgba(0, 0, 0, 0.09) 0 0 4px;
  overflow: hidden;
}
</style>