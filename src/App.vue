<script setup lang="ts">
import PoAside from '@/components/PoAside/index.vue'
import { useRoute } from 'vue-router'
import { useSettings } from '@/stores/settings'
import PoSeparation from '@/components/PoSeparation.vue'
import { onMounted } from 'vue'
import { testProjects } from '@/stores/service/project-service'

const route = useRoute()
const settings = useSettings()

onMounted(() => {
  testProjects()
})

</script>

<template>
  <div id="main">
    <div id="aside" :style="{'width':`${settings.sideWidth}px`}">
      <po-aside />
    </div>
    <div id="container" :style="{'width': `calc(100vw - ${settings.sideWidth}px)`}">
      <router-view :key="route.fullPath" />
    </div>
    <po-separation :style="{'left':`${settings.sideWidth}px`}" />
  </div>
</template>

<style scoped>

#main {
  position: relative;
  display: flex;
  flex-direction: row;
  width: 100vw;
  height: 100vh;
}

#aside {
  background: #edeef2;
  flex-shrink: 0;
}

#container {
  width: 100%;
  height: 100%;
  background: #82bbb5;
  border-radius: 8px 0 0 0;
}
</style>