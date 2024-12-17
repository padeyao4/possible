<script lang="ts" setup>
import type { Path } from '@/stores';
import { computed } from 'vue';

const { path } = defineProps<{
  path: Path
}>();


const style = computed(() => {
  return `M ${path.from!.x},${path.from!.y} C ${path.ctls[0].x},${path.ctls[0].y} ${path.ctls[1].x},${path.ctls[1].y} ${path.to!.x},${path.to!.y}`;
});
</script>

<template>
  <path :d="style" :data-graph-item-id="path.id" data-graph-item-shape="edge" fill="none" stroke="#000000"
    stroke-opacity="0.3" stroke-width="1" />
  <path :d="style" stroke="#00000050" fill="none" :data-graph-item-id="path.id" opacity="0" data-mouse-style="pointer"
    data-graph-item-shape="edge" stroke-opacity="0.7" stroke-width="9" pointer-events="visibleStroke" />
</template>

<style scoped>
path:hover {
  opacity: 0.8;
}
</style>
