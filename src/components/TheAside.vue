<script setup lang="ts">

import AsideHeader from '@/components/side/AsideHeader.vue'
import AsideBody from '@/components/side/AsideBody.vue'
import AsideFooter from '@/components/side/AsideFooter.vue'
import { useMouseStyle } from '@/stores/mouse'

const mouseStyle = useMouseStyle()

function onmouseover(event: MouseEvent) {
  mouseStyle.toggleMouseStyle(event)
}
</script>

<template>
  <div id="po-aside" @mouseover="onmouseover">
    <aside-header id="aside-header" />
    <aside-body id="aside-body" />
    <aside-footer id="aside-footer" />
  </div>
</template>

<style scoped>
#po-aside {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

#aside-header {
  height: min-content;
}

#aside-body {
  flex-grow: 1;
}

#aside-footer {
  flex-shrink: 0;
}
</style>