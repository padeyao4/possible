<script setup lang="ts">
import { inject, provide, type Ref, ref } from 'vue'
import CanvasContextmenu from '@/components/contextmenu/CanvasContextmenu.vue'
import NodeContextmenu from '@/components/contextmenu/NodeContextmenu.vue'
import { changeMouseStyle } from '@/stores/mouse'
import EdgeContextmenu from '@/components/contextmenu/EdgeContextmenu.vue'

const modeRef = ref<HTMLElement>()
const contextmenuRef = ref<HTMLElement>()
const contextmenuType = ref('')
const theCanvasRef = inject<Ref<HTMLElement>>('canvas')

provide('contextmenu', contextmenuRef)

function handleCancelMenu() {
  modeRef.value.toggleAttribute('data-pointer-event', false)
  contextmenuRef.value.toggleAttribute('data-show', false)
}

function oncontextmenu(e: PointerEvent) {
  e.stopPropagation()
  e.preventDefault()
  const target = e.target as Element
  if (!target.hasAttribute('data-type')) return

  const elementType = target.getAttribute('data-type')
  const contextmenu = contextmenuRef.value
  contextmenuType.value = elementType

  contextmenu.style.top = e.y + 'px'
  contextmenu.style.left = e.x + 'px'
  contextmenu.style.opacity = String(0)
  contextmenu.setAttribute('data-x', String(e.x))
  contextmenu.setAttribute('data-y', String(e.y))
  contextmenu.toggleAttribute('data-show', true)
  const targetId = target.getAttribute('data-key') ?? ''
  contextmenu.setAttribute('data-target-id', targetId)
  setTimeout(() => {
    const menuRect = contextmenu.getBoundingClientRect()
    const canvasRect = theCanvasRef.value.getBoundingClientRect()
    if (menuRect.right > canvasRect.right) {
      contextmenu.style.left = (e.x - menuRect.width) + 'px'
    }
    if (menuRect.bottom > canvasRect.bottom) {
      contextmenu.style.top = (canvasRect.bottom - menuRect.height) + 'px'
    }
    contextmenu.style.opacity = String(1)
    changeMouseStyle('default')
  })
  modeRef.value.toggleAttribute('data-pointer-event', true)
}

defineExpose({ oncontextmenu })

</script>

<template>
  <teleport to="body">
    <div id="contextmenu-mode" ref="modeRef" @click="handleCancelMenu" @contextmenu.prevent="handleCancelMenu">
      <div id="project-contextmenu" ref="contextmenuRef">
        <canvas-contextmenu v-if="contextmenuType==='canvas'" />
        <node-contextmenu v-if="contextmenuType==='node'" />
        <edge-contextmenu v-if="contextmenuType==='edge'" />
      </div>
    </div>
  </teleport>
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

#project-contextmenu {
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