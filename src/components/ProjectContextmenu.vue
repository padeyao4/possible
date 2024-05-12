<script setup lang="ts">
import { ref } from 'vue'
import CanvasContextmenu from '@/components/CanvasContextmenu.vue'

defineProps<{ contextmenuType: string }>()
const modeRef = ref<HTMLElement>()
const contextmenu = ref<HTMLElement>()

function onclick() {
  console.log('click')
  modeRef.value.toggleAttribute('data-pointer-event', false)
  contextmenu.value.toggleAttribute('data-show', false)
}
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