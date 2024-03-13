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
  <div id="root">
    <main>
      <header><h1>{{ currentProject.name }}</h1></header>
      <section>
        <timer-header id="timer-header" />
        <div id="container" ref="container"></div>
        <editor />
      </section>
      <footer>
        <reset-button />
      </footer>
    </main>
  </div>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  height: 100%;
}

header {
  height: 40px;
  flex-shrink: 0;
}

section {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  box-shadow: rgba(27, 31, 35, 0.06) 0 1px 0,
  rgba(255, 255, 255, 0.25) 0 1px 0 inset;
}

footer {
  flex-shrink: 0;
  height: 40px;
}

#timer-header {
  flex-shrink: 0;
}

#container {
  flex-grow: 1;
}
</style>