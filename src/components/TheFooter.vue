<script setup lang="ts">
import { currentProject } from '@/stores/service/project-service'
import { calculateDaysBetweenDates, useTimer } from '@/stores/timer'
import { useSettings } from '@/stores/settings'

const setting = useSettings()
const project = currentProject()
const timer = useTimer()

function handleBackHome() {
  project.offset.x = 0
  project.offset.y = 0
}

function handleToday() {
  project.offset.x = calculateDaysBetweenDates(project.createTime, timer.timestamp) * setting.unitWidth
}

</script>

<template>
  <div id="the-footer">
    <Icon icon="solar:home-2-broken" @click="handleBackHome" />
    <Icon icon="solar:map-point-broken" @click="handleToday" />
  </div>
</template>

<style scoped>
#the-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  & > * {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 32px;
    padding: 4px;
    border-radius: 6px;
    opacity: 0.7;

    &:hover {
      background-color: #b8823050;
    }
  }
}
</style>