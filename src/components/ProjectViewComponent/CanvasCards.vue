<script setup lang="ts">

import CanvasCardItem from '@/components/ProjectViewComponent/CanvasCardItem.vue'
import { currentProject } from '@/service/project.service'

const project = currentProject()
</script>

<template>
  <canvas-card-item v-for="node in project.nodeMap.values()" :node="node" :key="node.id" />
</template>

<style scoped>

</style>