<script setup lang="ts">
import { useDataStore } from '@/stores';
import { useCursor } from '@/stores/cursor';

const dataStore = useDataStore();
const cursor = useCursor();

let startX = 0;
let startWidth = 0;

function initDrag(e: MouseEvent) {
  startX = e.clientX;
  startWidth = dataStore.menuWidth;
  document.addEventListener('mousemove', doDrag);
  document.addEventListener('mouseup', stopDrag);
  cursor.lock('col-resize');
  document.body.style.userSelect = 'none';
}

function doDrag(e: MouseEvent) {
  const newWidth = startWidth + e.clientX - startX;
  if (newWidth <= 260) {
    dataStore.menuWidth = 260;
    dataStore.menuVisible = false;
  } else {
    dataStore.menuWidth = Math.min(460, newWidth);
    dataStore.menuVisible = true;
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
    v-if="dataStore.menuVisible" 
    class="absolute inset-0 hover:cursor-col-resize" 
    :style="{
      width: '5px',
      left: `${dataStore.menuWidth}px`,
      zIndex: 999,
      backgroundColor: 'transparent'
    }" 
    @mousedown="initDrag" 
  />
</template> 