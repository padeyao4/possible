<script setup>
import { provide, ref } from 'vue'
import useGraph from '@/g6/index.js'
import ResetButton from '@/components/ResetButton.vue'
import { useStore } from '@/stores/store.ts'
import TimerHeader from '@/components/TimerHeader.vue'
import GraphEditor from '@/components/GraphEditor.vue'
import PickDateButton from '@/components/PickDateButton.vue'
import GraphContextmenu from '@/components/GraphContextmenu.vue'

const store = useStore()
const container = ref()
const { currentProject } = store
const { graph } = useGraph(container)

provide('graph', graph)
</script>

<template>
  <div>
    <main>
      <div class="content">
        <header>{{ currentProject.name }}</header>
        <section>
          <timer-header id="timer-header" />
          <div id="container" ref="container"></div>
          <graph-editor />
          <graph-contextmenu />
        </section>
      </div>
      <footer>
        <reset-button />
        <pick-date-button />
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

.content {
  flex-grow: 1;
  padding: 24px 24px 0 24px;
  box-shadow: rgba(27, 31, 35, 0.06) 0 1px 0,
  rgba(255, 255, 255, 0.25) 0 1px 0 inset;
}

footer {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  height: 48px;
  padding: 0 24px;

  & > * {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 3px;
    margin: 0 4px;
    user-select: none;
  }

  & > *:hover {
    background: rgba(0, 0, 0, 0.1);
  }
}

header {
  display: flex;
  outline: none;
  flex-shrink: 0;
  height: 32px;
  font-size: 20px;
  -webkit-app-region: no-drag;
  user-select: none;
  margin: 0 0 24px 0;
}

section {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
}

#timer-header {
  flex-shrink: 0;
}

#container {
  height: calc(100vh - 24px * 2 - 32px - 40px - 48px);
}
</style>