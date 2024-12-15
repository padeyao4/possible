<script lang="ts" setup>
import CanvasRuler from '@/components/project/CanvasRuler.vue';
import CanvasHeader from '@/components/project/CanvasHeader.vue';
import TheCanvas from '@/components/project/TheCanvas.vue';
import { useDataStore,ONE_DAY_MS } from '@/stores';
import ProjectLockButton from '@/components/ProjectLockButton.vue';
import ProjectLocationButton from '@/components/ProjectLocationButton.vue';
import ProjectHomeButton from '@/components/ProjectHomeButton.vue';
import ProjectCalenderButton from '@/components/ProjectCalenderButton.vue';

const graph = useDataStore();
const project = graph.project;
const isDev = import.meta.env.MODE !== 'production';
</script>

<template>
  <div class="flex h-screen flex-col border-l border-r">
    <header
      class="drag-region flex h-16 shrink-0 items-end justify-start px-3 pb-3 text-xl text-gray-500"
    >
      <div class="truncate">
        {{ project?.name }}
      </div>
    </header>
    <main class="main relative grid grow border-t border-gray-200">
      <project-lock-button />
      <canvas-header />
      <canvas-ruler />
      <the-canvas />
    </main>
    <footer class="col-span-2 border-t border-gray-200 bg-transparent bg-white">
      <ProjectHomeButton />
      <ProjectLocationButton />
      <ProjectCalenderButton />
      <button v-if="isDev" @click="graph.updateNodes()">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.8)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
      </button>
      <button v-if="isDev" @click="graph.timestamp += ONE_DAY_MS">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.8)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      </button>
    </footer>
  </div>
</template>
<style>
.main {
  grid-template-rows: 40px calc(100vh - 153px);
  grid-template-columns: 40px calc(100% - 40px);
  background-color: #f2f4f7;
}

footer {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 48px;

  & > * {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: 4px;
    border-radius: 8px;
    opacity: 0.7;

    &:hover {
      background-color: #b8823050;
    }
  }
}
</style>
