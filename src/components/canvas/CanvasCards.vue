<script setup lang="ts">

import CanvasCardItem from '@/components/canvas/CanvasCardItem.vue'
import { currentProject } from '@/stores/service/project-service'

const project = currentProject()
</script>

<template>
  <canvas-card-item v-for="node in project.nodeMap.values()" :node="node" :key="node.id" />
</template>

<style scoped>

</style>