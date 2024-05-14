<script setup lang="ts">
import { useEventListener, useWindowSize } from '@vueuse/core'
import { useSettings } from '@/stores/settings'
import { ref } from 'vue'

const settings = useSettings()
const { width } = useWindowSize()

const attr = { x: 0, width: 0, down: false }
const drag = ref<HTMLElement>()

function setWidth(w: number) {
  if (w <= 200 || w >= width.value - 400) {
    return
  }
  settings.sideWidth = w
}

function onmousedown(ev: MouseEvent) {
  if (!attr.down) {
    attr.x = ev.x
    attr.width = settings.sideWidth
    attr.down = true
    const el = ev.target as HTMLElement
    el.toggleAttribute('mode', true)
  }
}

function onmousemove(ev: MouseEvent) {
  if (attr.down) {
    const dx = ev.x - attr.x
    setWidth(dx + attr.width)
  }
}

function onmouseup() {
  if (attr.down) {
    attr.down = false
    drag.value.toggleAttribute('mode', false)
    drag.value.style.left = settings.sideWidth + 'px'
  }
}

useEventListener(window, 'mousemove', onmousemove)
useEventListener(window, 'mouseup', onmouseup)
</script>

<template>
  <div id="drag-bar" @mousedown="onmousedown" ref="drag" />
</template>

<style scoped>
#drag-bar {
  &:hover {
    cursor: e-resize;
  }

  &[mode] {
    left: 0 !important;
    top: 0;
    bottom: 0;
    right: 0;
    width: 100vw;
    cursor: e-resize;
  }
}
</style>