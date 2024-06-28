<script setup lang="ts">
import AsideBody from '@/components/LayoutSide/AsideBody.vue';
import AsideFooter from '@/components/LayoutSide/AsideFooter.vue';
import AsideHeader from '@/components/LayoutSide/AsideHeader.vue';
import { useCursor } from '@/stores/cursor';

const cursor = useCursor();

function onmouseover(event: MouseEvent) {
  cursor.refresh(event);
}
</script>

<template>
  <div class="the-side" @mouseover="onmouseover">
    <aside-header class="side-header" />
    <aside-body class="side-body" />
    <aside-footer class="side-footer" />
  </div>
</template>

<style scoped>
.the-side {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.side-header {
  height: min-content;
}

.side-body {
  flex-grow: 1;
}

.side-footer {
  flex-shrink: 0;
}
</style>
