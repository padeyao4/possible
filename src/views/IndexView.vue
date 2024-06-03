<script setup lang="ts">
import TheSide from '@/components/IndexViewComponent/TheSide.vue'
import TheSeparation from '@/components/common/TheSeparation.vue'
import { useProjects } from '@/stores/projects';
import { useSettings } from '@/stores/settings'
import { getIndexByDate } from '@/stores/timer';
import { computed, provide } from 'vue'

const settings = useSettings()

const width = computed(() => settings.sideWidth + 'px')

const projects = useProjects()

const nodes = computed(() => {
  return Array.from(projects.projectMap.values())
    .map((project) => {
      const curX = getIndexByDate(project)
      const { nodeMap } = project
      return Array.from(nodeMap.values()).filter((node) => {
        return node.x <= curX && curX < node.x + node.width
      })
    })
    .flat()
})

const todoList = computed(() => {
  return nodes.value
    .filter((node) => node.completed === false)
    .sort((a, b) => {
      return a.sortedIndex - b.sortedIndex
    })
})

const completedList = computed(() => {
  return nodes.value
    .filter((node) => node.completed === true)
    .sort((a, b) => {
      return a.sortedIndex - b.sortedIndex
    })
})

provide('todoList', todoList)
provide('completedList', completedList)
provide('nodes', nodes)
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
  overflow: hidden;
  background-color: var(--background-middle-color);
  border-left: 1px solid #00000020;
  border-radius: 8px 0 0 0;
}
</style>
