<script setup lang="ts">
import GraphContextmenu from '@/components/GraphContextmenu.vue'
import GraphEditor from '@/components/GraphEditor.vue'
import PickDateButton from '@/components/PickDateButton.vue'
import ResetButton from '@/components/ResetButton.vue'
import TestButton from '@/components/TestButton.vue'
import TestRestoreButton from '@/components/TestRestoreButton.vue'
import TestRightButton from '@/components/TestRightButton.vue'
import TimerHeader from '@/components/TimerHeader.vue'
import useGraph from '@/g6'
import { useStore } from '@/stores/store'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

const store = useStore()
const container = ref()
useGraph(container)
const route = useRoute()

const currentProject = computed(() => {
  return store.projects[route.params.id as string]
})

</script>

<template>
  <div id="project-view">
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
      <test-button />
      <test-right-button />
      <test-restore-button />
    </footer>
  </div>
</template>

<style scoped>
#project-view {
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: calc(100vw - 240px - 24px * 2);
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