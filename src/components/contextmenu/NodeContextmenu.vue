<script setup lang="ts">

import { inject, type Ref } from 'vue'
import { currentProject, deleteNodeById } from '@/stores/service/project-service'

const project = currentProject()
const contextmenuRef = inject<Ref<HTMLElement>>('contextmenu')

function handleDelete() {
  const id = contextmenuRef.value.getAttribute('data-target-id')
  deleteNodeById(project, id)
}
</script>

<template>
  <div class="canvas-contextmenu-list">
    <div @click="handleDelete">删除</div>
  </div>
</template>

<style scoped>
</style>