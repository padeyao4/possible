<script setup lang="ts">
import { inject, type Ref, ref } from 'vue'
import CanvasContextmenu from '@/components/CanvasContextmenu.vue'

const modeRef = ref<HTMLElement>()
const contextmenu = ref<HTMLElement>()
const contextmenuType = ref<'canvas' | 'node' | 'edge'>('')
const theCanvasRef = inject<Ref<HTMLElement>>('canvas')

function onclick() {
  console.log('click')
  modeRef.value.toggleAttribute('data-pointer-event', false)
  contextmenu.value.toggleAttribute('data-show', false)
}

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

function handleNodeType(e: PointerEvent) {
  // todo
}

function handleCanvasType(e: PointerEvent) {
  const el = contextmenu.value
  contextmenuType.value = 'canvas'
  el.style.top = e.y + 'px'
  el.style.left = e.x + 'px'
  el.style.opacity = 0
  el.toggleAttribute('data-show', true)

  setTimeout(() => {
    const menuRect = el.getBoundingClientRect()
    const canvasRect = theCanvasRef.value.getBoundingClientRect()

    if (menuRect.right > canvasRect.right) {
      el.style.left = (e.x - menuRect.width) + 'px'
    }

    if (menuRect.bottom > canvasRect.bottom) {
      el.style.top = (canvasRect.bottom - menuRect.height) + 'px'
    }
    el.style.opacity = 1
  })
  modeRef.value.toggleAttribute('data-pointer-event', true)
}

defineExpose({ oncontextmenu })

</script>

<template>
  <div id="contextmenu-mode" ref="modeRef" @click="onclick" @contextmenu.prevent="onclick">
    <div id="canvas-contextmenu" ref="contextmenu">
      <canvas-contextmenu v-if="contextmenuType==='canvas'" />
    </div>
  </div>
</template>

<style scoped>
#contextmenu-mode {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  pointer-events: none;
  background-color: rgba(0, 0, 0, 0);

  &[data-pointer-event] {
    pointer-events: auto;
  }
}

#canvas-contextmenu {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  background: #606266;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  border-radius: 8px;

  &[data-show] {
    display: flex;
  }
}
</style>