<script setup lang="ts">
import { clamp } from '@/graph/math';
import { useSettings } from '@/stores/settings';
import { useEventListener, useWindowSize } from '@vueuse/core';
import { computed, ref } from 'vue';

const settings = useSettings();
const { width: clientWidth } = useWindowSize();

const attr = { x: 0, width: 0, down: false };
const drag = ref<HTMLElement>();

function onmousedown(ev: MouseEvent) {
  if (!attr.down) {
    attr.x = ev.x;
    attr.width = settings.sideWidth;
    attr.down = true;
    const el = ev.target as HTMLElement;
    el.toggleAttribute('mode', true);
  }
}

function onmousemove(ev: MouseEvent) {
  if (attr.down) {
    const dx = ev.x - attr.x;
    const width = dx + attr.width;
    settings.sideWidth = clamp(width, 220, clientWidth.value - 400);
  }
}

function onmouseup() {
  if (attr.down) {
    attr.down = false;
    drag.value.toggleAttribute('mode', false);
    drag.value.style.left = settings.sideWidth + 'px';
  }
}

const sideWidth = computed(() => settings.sideWidth + 'px');

useEventListener(window, 'mousemove', onmousemove);
useEventListener(window, 'mouseup', onmouseup);
useEventListener(window, 'resize', () => {
  settings.sideWidth = clamp(settings.sideWidth, 200, clientWidth.value - 400);
  drag.value.style.left = settings.sideWidth + 'px';
});
</script>

<template>
  <div class="drag-bar" @mousedown="onmousedown" ref="drag" />
</template>

<style scoped>
.drag-bar {
  position: absolute;
  top: 0;
  bottom: 0;
  left: v-bind(sideWidth);
  width: 5px;

  &:hover {
    cursor: ew-resize;
  }

  &[mode] {
    top: 0;
    right: 0;
    bottom: 0;
    left: 0 !important;
    width: 100vw;
    cursor: ew-resize;
  }
}
</style>
