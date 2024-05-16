<script setup lang="ts">
import { useSettings } from '@/stores/settings'
import { currentProject } from '@/stores/service/project.service'
import { computed } from 'vue'

const settings = useSettings()
const project = currentProject()

const translateX = computed(() => {
  return project.offset.x % settings.unitWidth - settings.unitWidth + 'px'
})

const size = computed(() => {
  return settings.unitWidth + 'px'
})
</script>

<template>
  <div class="canvas-grid">
    <div class="container" />
  </div>
</template>

<style scoped>
.canvas-grid {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin-top: 40px;
  margin-left: 40px;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.container {
  width: 150%;
  height: 100%;
  background-image: linear-gradient(
    90deg,
    transparent 0px,
    transparent 119px,
    rgba(27, 31, 35, 0.06) 119px,
    rgba(27, 31, 35, 0.06) 120px
  );
  background-size: v-bind(size);
  transform: translateX(v-bind(translateX));
}
</style>