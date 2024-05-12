<script setup lang="ts">
import { addNode, createNodeTemplate, currentProject } from '@/stores/service/project-service'
import { inject, type Ref } from 'vue'

const contextmenuRef = inject<Ref<HTMLElement>>('contextmenu')
const canvasRef = inject<Ref<HTMLElement>>('canvas')

const project = currentProject()

function handleNewNode() {
  const x = contextmenuRef.value.getAttribute('data-x')
  const y = contextmenuRef.value.getAttribute('data-y')
  const box = canvasRef.value.getBoundingClientRect()
  const cx = box.x
  const cy = box.y
  console.log(x, y, cx, cy, x - cx, y - cy,)
  const node = createNodeTemplate()
  addNode(project, node)
}

</script>

<template>
  <div id="canvas-type-menu">
    <div @click="handleNewNode">新建</div>
  </div>
</template>

<style scoped>
#canvas-type-menu {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150px;
  padding: 8px;
  color: white;

  & > * {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 32px;

    &:hover {
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.3);
    }
  }
}
</style>