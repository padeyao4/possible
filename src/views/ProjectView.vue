<script lang="ts" setup>
import MenuToggleButton from '@/components/common/MenuToggleButton.vue';
import IconButton from '@/components/IconButton.vue';
import CanvasHeader from '@/components/project/CanvasHeader.vue';
import CanvasRuler from '@/components/project/CanvasRuler.vue';
import TheCanvas from '@/components/project/TheCanvas.vue';
import ProjectHomeButton from '@/components/ProjectHomeButton.vue';
import ProjectLocationButton from '@/components/ProjectLocationButton.vue';
import ProjectLockButton from '@/components/ProjectLockButton.vue';
import { CARD_WIDTH, days, ONE_DAY_MS, useLayoutStore, usePlanStore } from '@/stores';
import { computed, onMounted, onUnmounted, ref } from 'vue';

const props = defineProps<{
  id: string;
}>()

const layoutStore = useLayoutStore();
const planStore = usePlanStore();
const project = computed(() => planStore.getPlan(props.id));

const isDev = import.meta.env.MODE !== 'production';
const canvasContainer = ref<HTMLElement | null>(null);
const mainHeight = ref(0);
const mainWidth = ref(0);

// 创建 ResizeObserver 监听 main 元素大小变化
let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  if (canvasContainer.value) {
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        mainHeight.value = entry.contentRect.height;
        mainWidth.value = entry.contentRect.width;
      }
    });

    resizeObserver.observe(canvasContainer.value);
  }
});

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
});

function handleDateChange(val: Date) {
  const offsetX = -days(val) * CARD_WIDTH - CARD_WIDTH;
  planStore.project!.offsetX! = (offsetX > 0 ? offsetX - 1 : offsetX);
}

const date = ref(new Date());

const showCalendarIconButton = ref(true)

function handleCalendar() {
  handleDateChange(date.value)
  showCalendarIconButton.value = true
}

const datePicker = ref<HTMLInputElement | null>(null)

function handleCalendarIconClick() {
  showCalendarIconButton.value = false
  setTimeout(() => {
    datePicker.value?.focus()
  }, 10)
}

</script>

<template>
  <div class="flex h-screen flex-col border-l border-r overflow-hidden">
    <header
      class="drag-region flex h-[60px] mt-2 px-5 shrink-0 flex-col items-start justify-end pb-3 text-xl text-gray-500">
      <menu-toggle-button v-if="!layoutStore.menuVisible" />
      <div v-else class="w-6 h-6"></div>
      <div class="truncate">
        {{ project?.name }}
      </div>
    </header>
    <main class="main relative grid flex-1 border-t border-gray-200 overflow-hidden" ref="canvasContainer">
      <project-lock-button />
      <canvas-header :height="mainHeight" :width="mainWidth" :project="project!" />
      <canvas-ruler :height="mainHeight" :width="mainWidth" :project="project!" />
      <the-canvas :height="mainHeight" :width="mainWidth" :project="project!" />
    </main>
    <footer class="h-[48px] shrink-0 border-t border-gray-200 bg-transparent bg-white">
      <el-tooltip content="项目初始位置" placement="top">
        <ProjectHomeButton class="icon-button" />
      </el-tooltip>
      <el-tooltip content="今天" placement="top">
        <ProjectLocationButton class="icon-button" />
      </el-tooltip>
      <el-tooltip content="日历" placement="top" v-if="showCalendarIconButton">
        <calender-icon class="icon-button" @click="handleCalendarIconClick" />
      </el-tooltip>
      <el-date-picker v-else v-model="date" type="date" ref="datePicker" @blur="showCalendarIconButton = true"
        @change="handleDateChange" @keydown.enter="handleCalendar" />

      <el-tooltip content="更新计划" placement="top">
        <update-icon class="icon-button" @click="() => { planStore.updatePlans(); }" />
      </el-tooltip>

      <IconButton title="时间线" v-if="isDev" @click="layoutStore.timestamp += ONE_DAY_MS" class="icon-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="rgba(0,0,0,0.8)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      </IconButton>
    </footer>
  </div>
</template>
<style>
.main {
  grid-template-rows: 40px 1fr;
  grid-template-columns: 50px calc(100% - 50px);
  background-color: #f2f4f7;
}

footer {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 48px;
}

.icon-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 4px;
  border-radius: 8px;
  opacity: 0.7;
  outline: none;

  &:hover {
    background-color: #b8823050;
  }
}
</style>
