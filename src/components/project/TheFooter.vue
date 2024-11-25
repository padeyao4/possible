<script setup lang="ts">
import { type ComputedRef, inject, ref } from 'vue';
import HomeIcon from '@/components/icon/HomeIcon.vue';
import MapPointIcon from '@/components/icon/MapPointIcon.vue';
import TestTubeIcon from '@/components/icon/TestTubeIcon.vue';
import CalendarSearchIcon from '@/components/icon/CalendarSearchIcon.vue';
import ArrowRightIcon from '@/components/icon/ArrowRightIcon.vue';
import type { Project } from '@/stores'

const project = inject<ComputedRef<Project>>('project');

function handleBackHome() {
  project.value.x = 0;
  project.value.y = 0;
}

function handleToday() {
  // project.value.setOffsetIndex(timer.timestamp);
}

function handleTest() {
  // console.log(project.value.offset);
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
    // project.value.setOffsetIndex(date);
  }
}
</script>

<template>
  <div
    class="the-footer col-span-2 border-t border-gray-200 bg-transparent"
    style="background-color: #fff"
  >
    <HomeIcon @click="handleBackHome" />
    <MapPointIcon @click="handleToday" />
    <!--    <TestTubeIcon @click="handleTest" />-->
    <div>
      <CalendarSearchIcon for="calendar-input" class="calendar-icon" @click="handleCalendar" />
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
    <!--    <ArrowRightIcon @click="handleMoveRight" />-->
  </div>
</template>

<style scoped>
.the-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;

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
