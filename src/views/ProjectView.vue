<script setup lang="ts">
import GraphContextmenu from '@/components/GraphContextmenu.vue'
import GraphEditor from '@/components/GraphEditor.vue'
import PickDateButton from '@/components/PickDateButton.vue'
import ResetButton from '@/components/ResetButton.vue'
import GraphTimerHeader from '@/components/GraphTimerHeader.vue'
import { useStore } from '@/stores/store'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import GraphRuler from '@/components/GraphRuler.vue'
import GraphContainer from '@/components/GraphContainer.vue'

const store = useStore()
const route = useRoute()

const currentProject = computed(() => store.projects[route.params.id as string])
</script>

<template>
  <div id="project-view">
    <header data-tauri-drag-region>{{ currentProject.name }}</header>
    <main>
      <graph-container />
      <graph-ruler />
      <graph-timer-header />
      <graph-editor />
      <graph-contextmenu />
    </main>
    <footer>
      <reset-button />
      <pick-date-button />
    </footer>
  </div>
</template>

<style scoped>
#project-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

header {
  display: flex;
  align-items: center;
  outline: none;
  height: 40px;
  font-size: 20px;
  margin: 24px;
  white-space: nowrap;
  overflow-x: hidden;
  text-overflow: ellipsis;
  flex-shrink: 0;
}

main {
  position: relative;
  display: flex;
  flex-grow: 1;
  height: calc(100vh - 24px * 2 - 40px - 48px);
  width: calc(100vw - 240px - 24px * 2);
  margin: 0 24px;
  border-radius: 8px 8px 0 0;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.01);
}

footer {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  height: 48px;
  box-shadow: rgba(27, 31, 35, 0.06) 0 -1px 0,
  rgba(255, 255, 255, 0.25) 0 -1px 0 inset;

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
</style>