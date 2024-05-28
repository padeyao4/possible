<script setup lang="ts">
import { useSettings } from '@/stores/settings'
import { currentProject } from '@/service/project.service'
import { computed } from 'vue'

const settings = useSettings()
const project = currentProject()

const translateX = computed(
  () => (project.offset.x % settings.unitWidth) - settings.unitWidth + 'px'
)

const translateY = computed(() => {
  return (project.offset.y % settings.unitHeight) - settings.unitHeight + 'px'
})

const width = computed(() => {
  return settings.unitWidth + 'px'
})

const height = computed(() => {
  return settings.unitHeight + 'px'
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
  width: 300%;
  height: 300%;
  background:
    linear-gradient(
        90deg,
        transparent 0px,
        transparent 119px,
        rgba(27, 31, 35, 0.06) 119px,
        rgba(27, 31, 35, 0.06) 120px
      )
      repeat,
    linear-gradient(
        0deg,
        rgba(27, 31, 35, 0.06) 0px,
        rgba(27, 31, 35, 0.06) 1px,
        transparent 1px,
        transparent 80px
      )
      repeat;
  background-size: v-bind(width) v-bind(height);
  transform: translateX(v-bind(translateX)) translateY(v-bind(translateY));
}
</style>
