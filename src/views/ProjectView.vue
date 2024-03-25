<script setup lang="ts">
import GraphContextmenu from '@/components/GraphContextmenu.vue'
import GraphEditor from '@/components/GraphEditor.vue'
import PickDateButton from '@/components/PickDateButton.vue'
import ResetButton from '@/components/ResetButton.vue'
import TestButton from '@/components/TestButton.vue'
import TestRestoreButton from '@/components/TestRestoreButton.vue'
import TestRightButton from '@/components/TestRightButton.vue'
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
    <header>{{ currentProject.name }}</header>
    <main>
      <graph-timer-header />
      <div class="content">
        <graph-ruler />
        <graph-container />
      </div>
      <graph-editor />
      <graph-contextmenu />
    </main>
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

header {
  display: flex;
  outline: none;
  flex-shrink: 0;
  height: 80px;
  font-size: 20px;
  -webkit-app-region: no-drag;
  user-select: none;
  padding: 24px 24px 24px 24px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: calc(100vw - 240px);
}

main {
  display: flex;
  height: calc(100vh - 48px - 80px);
  flex-direction: column;

  .content {
    width: 100%;
    height: calc(100vh - 48px - 80px - 40px);
    display: flex;
    flex-direction: row;
  }
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