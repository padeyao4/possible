<script setup>
import { provide, ref } from 'vue'
import useGraph from '@/g6/index.js'
import Editor from '@/components/Editor.vue'
import TimerHeader from '@/components/TimerHeader.vue'
import ResetButton from '@/components/ResetButton.vue'
import { useStore } from '@/stores/store.ts'

const store = useStore()

const { currentProject } = store
const container = ref()

const { graph, current, selected } = useGraph(container)

provide('graph', graph)
provide('current', current)
provide('selected', selected)
provide('container', container)

</script>

<template>
  <main>
    <header><h1>{{ currentProject.name}}</h1></header>
    <timer-header />
    <div id="container" ref="container"></div>
    <editor />
    <footer>
      <reset-button />
    </footer>
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