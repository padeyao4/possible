<script setup lang="ts">
import { useLayoutStore } from '@/stores';
import { useCursor } from '@/stores/cursor';

const layoutStore = useLayoutStore();
const cursor = useCursor();

let startX = 0;
let startWidth = 0;

function initDrag(e: MouseEvent) {
  startX = e.clientX;
  startWidth = layoutStore.menuWidth;
  document.addEventListener('mousemove', doDrag);
  document.addEventListener('mouseup', stopDrag);
  cursor.lock('col-resize');
  document.body.style.userSelect = 'none';
}

function doDrag(e: MouseEvent) {
  const newWidth = startWidth + e.clientX - startX;
  if (newWidth <= 260) {
    layoutStore.menuWidth = 260;
    layoutStore.menuVisible = false;
  } else {
    layoutStore.menuWidth = Math.min(460, newWidth);
    layoutStore.menuVisible = true;
  }
}

function stopDrag() {
  document.removeEventListener('mousemove', doDrag);
  document.removeEventListener('mouseup', stopDrag);
  document.body.style.userSelect = '';
  cursor.unlock();
  cursor.setWithUnlock('default');
}
</script>

<template>
  <div 
    v-if="layoutStore.menuVisible" 
    class="absolute inset-0 hover:cursor-col-resize" 
    :style="{
      width: '5px',
      left: `${layoutStore.menuWidth}px`,
      zIndex: 999,
      backgroundColor: 'transparent'
    }" 
    @mousedown="initDrag" 
  />
</template> 