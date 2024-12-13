<script setup lang="ts">
import { reactive, ref } from 'vue';
import { days, useDataStore } from '@/stores';

const graph = useDataStore();

const viewModel = reactive({
  inputValue: <string>undefined
});

const dateInputRef = ref<HTMLElement & { showPicker: () => void }>();

function handleCalendar() {
  dateInputRef.value?.showPicker();
}

function handleChange() {
  if (viewModel.inputValue) {
    const offsetX = -days(new Date(viewModel.inputValue)) * graph.cardWidth;
    graph.project.x = offsetX > 0 ? offsetX - 1 : offsetX;
  }
}
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    class="calendar-icon"
    @click="handleCalendar"
  >
    <g fill="none" stroke="currentColor" stroke-width="1.5">
      <path
        stroke-linecap="round"
        d="M22 14v-2c0-3.771 0-5.657-1.172-6.828C19.657 4 17.771 4 14 4m0 18h-4c-3.771 0-5.657 0-6.828-1.172C2 19.657 2 17.771 2 14v-2c0-3.771 0-5.657 1.172-6.828C4.343 4 6.229 4 10 4M7 4V2.5M17 4V2.5"
      />
      <circle cx="18" cy="18" r="3" />
      <path stroke-linecap="round" d="M20.5 20.5L22 22m-.5-13H10.75M2 9h3.875" />
    </g>
  </svg>
  <input
    ref="dateInputRef"
    v-model="viewModel.inputValue"
    class="date-select"
    orientation="bottom"
    type="date"
    @change="handleChange"
  />
</template>

<style scoped>
.calendar-icon {
  width: 32px;
  height: 32px;
}

.date-select {
  top: -6px;
  left: -125px;
  background-color: #b8823050;
  border: 1px solid #00000020;
  border-radius: 4px;
  visibility: hidden;
}
</style>
