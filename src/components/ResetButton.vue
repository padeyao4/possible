<script setup>

import { inject } from 'vue'

const graph = inject('graph')

function handleClick() {
  setTimeout(() => {
    const { x, y } = graph.value.getCanvasByViewport({ x: 0, y: 0 })
    graph.value.translate({ dx: x, dy: y })
  })
}
</script>

<template>
  <main>
    <button @click="handleClick">reset</button>
  </main>
</template>

<style scoped>
main {
  display: flex;
  justify-content: center;
  align-content: center;
  width: 40px;
  height: 40px;
}
</style>