<script setup lang="ts">
import { currentProject } from '@/service/project.service';
import { useProjectStore } from '@/stores/project';
import { useTimer } from '@/stores/timer';
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
import type Project from '@/core/Project';

const project = currentProject();
const timer = useTimer();
const { setOffsetByDate } = useProjectStore();

function handleBackHome() {
  project.offset.x = 0;
  project.offset.y = 0;
}

function handleToday() {
  setOffsetByDate(<Project>project, timer.timestamp);
}

function handleTest() {
  console.log(project.offset);
}

function handleMoveRight() {}

const dateInput = ref<HTMLElement & { showPicker: () => void }>();

function handleCalendar() {
  dateInput.value?.showPicker();
}

const dateInputValue = defineModel();

function handleDateChange() {
  const date = dateInputValue.value as string;
  if (date !== '' && date !== null) {
    setOffsetByDate(<Project>project, date);
  }
}
</script>

<template>
  <div class="the-footer">
    <Icon icon="solar:home-2-broken" @click="handleBackHome" />
    <Icon icon="solar:map-point-broken" @click="handleToday" />
    <Icon icon="solar:test-tube-broken" @click="handleTest" />
    <div>
      <Icon
        icon="solar:calendar-search-broken"
        for="calendar-input"
        class="calendar-icon"
        @click="handleCalendar"
      />
      <input
        type="date"
        v-model="dateInputValue"
        class="date-select"
        orientation="top"
        ref="dateInput"
        id="calendar-input"
        @change="handleDateChange"
      />
    </div>
    <Icon icon="solar:round-alt-arrow-right-broken" @click="handleMoveRight" />
  </div>
</template>

<style scoped>
.the-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

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

.calendar-icon {
  width: 32px;
  height: 32px;
}

.date-select {
  position: absolute;
  top: -10px;
  background-color: #b8823050;
  border: 1px solid #00000020;
  border-radius: 4px;
  visibility: hidden;
}
</style>
