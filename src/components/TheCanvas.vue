<script setup lang="ts">
import CanvasHeader from '@/components/CanvasHeader.vue'
import CanvasRuler from '@/components/CanvasRuler.vue'
import CanvasGrid from '@/components/CanvasGrid.vue'
import CanvasContent from '@/components/CanvasContent.vue'
import ProjectContextmenu from '@/components/ProjectContextmenu.vue'
import { ref } from 'vue'

function oncontextmenu(e: PointerEvent) {
  e.stopPropagation()
  e.preventDefault()
  const el = e.target as Element
  if (el.hasAttribute('data-type')) {
    const elementType = el.getAttribute('data-type')
    switch (elementType) {
      case 'node':
        handleNodeType(e)
        break
      case 'canvas':
        handleCanvasType(e)
        break
      case 'edge':
        break
    }
  }
}

const contextmenuType = ref<'canvas' | 'node' | 'edge'>()

function handleNodeType(e: PointerEvent) {
  // todo
}

function handleCanvasType(e: PointerEvent) {
  const el = document.getElementById('canvas-contextmenu')
  contextmenuType.value = 'canvas'
  el.style.top = e.y + 'px'
  el.style.left = e.x + 'px'
  el.toggleAttribute('data-show', true)
  const mode = document.getElementById('contextmenu-mode')
  mode.toggleAttribute('data-pointer-event', true)
}
</script>

<template>
  <div id="the-canvas" @contextmenu.capture="oncontextmenu">
    <canvas-grid />
    <canvas-content />
    <canvas-header />
    <canvas-ruler />
    <div id="block" class="canvas-background-color"></div>
    <teleport to="body">
      <project-contextmenu :contextmenu-type="contextmenuType" />
    </teleport>
  </div>
</template>

<style scoped>
#the-canvas {
  position: relative;
  width: 100%;
  height: 100%;
}

#block {
  position: absolute;
  top: 0;
  left: 0;
  width: 21px;
  height: 40px;
}
</style>