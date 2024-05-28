<script setup lang="ts">
import AsideHeader from '@/components/IndexViewComponent/AsideHeader.vue'
import AsideBody from '@/components/IndexViewComponent/AsideBody.vue'
import AsideFooter from '@/components/IndexViewComponent/AsideFooter.vue'
import { useMouseStyle } from '@/stores/mouse'

const mouseStyle = useMouseStyle()

function onmouseover(event: MouseEvent) {
  mouseStyle.toggleMouseStyle(event)
}
</script>

<template>
  <div class="the-aside" @mouseover="onmouseover">
    <aside-header class="aside-header" />
    <aside-body class="aside-body" />
    <aside-footer class="aside-footer" />
  </div>
</template>

<style scoped>
.the-aside {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.aside-header {
  height: min-content;
}

.aside-body {
  flex-grow: 1;
}

.aside-footer {
  flex-shrink: 0;
}
</style>
