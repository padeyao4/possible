<script lang="ts" setup>
import { ref } from 'vue';
import HomeIcon from '@/components/icon/HomeIcon.vue';
import MapPointIcon from '@/components/icon/MapPointIcon.vue';
import CalendarSearchIcon from '@/components/icon/CalendarSearchIcon.vue';
import { useGraph } from '@/stores';

const graph = useGraph();
const project = graph.project;

function handleBackHome() {
  project.x = 0;
  project.y = 0;
}

function handleToday() {
  // project.setOffsetIndex(timer.timestamp);
}

function handleTest() {
  // console.log(project.offset);
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
    // project.setOffsetIndex(date);
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
      <CalendarSearchIcon class="calendar-icon" for="calendar-input" @click="handleCalendar" />
      <input
        id="calendar-input"
        ref="dateInput"
        v-model="dateInputValue"
        class="date-select"
        orientation="top"
        type="date"
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
