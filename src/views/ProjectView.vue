<script setup>
import { provide, ref } from 'vue'
import useGraph from '@/g6/index.js'
import Editor from '@/components/Editor.vue'

const container = ref()

const { graph, current, selected } = useGraph(container)

provide('graph', graph)
provide('current', current)
provide('selected', selected)

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
    <div id="container" ref="container"></div>
    <editor />
  </main>
</template>

<style scoped>
main {
  background: aquamarine;
  display: flex;
  flex-direction: column;
}

#container {
  width: 800px;
  height: 600px;
  background: aliceblue;
}
</style>