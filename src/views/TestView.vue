<script setup lang="ts">
import { ref } from 'vue';
const svgRef = ref();
const pathRef = ref();
</script>

<template>
  <div class="container h-full border-b border-gray-300">
    <svg width="200" height="200" ref="svgRef">
      <path
        d="M50,50 Q100,150 150,50"
        ref="pathRef"
        stroke="black"
        stroke-width="5"
        fill="green"
        pointer-events="visibleStroke"
      />
    </svg>
  </div>
</template>

<style scoped>
path:hover {
  stroke: blue;
}
</style>
