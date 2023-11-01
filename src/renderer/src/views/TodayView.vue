<script setup lang="ts">
import { useProjectStore } from '@renderer/store/project'
import { useTodayStore } from '@renderer/store/day'
import { computed } from 'vue'
import { date2X } from '@renderer/util'

const projectStore = useProjectStore()
const todayStore = useTodayStore()

const data = computed(() => {
  return projectStore.projects
    .map((project) => {
      const x = date2X(todayStore.today, project.initDate)
      return project.tasks.filter((task) => task.x === x && task.state !== 'completed')
    })
    .flat()
})
</script>
<template>
  <div class="my-day">
    <div v-for="task in data" :key="task.id">
      <div class="item">{{ task.name }}</div>
    </div>
  </div>
</template>
<style>
.my-day {
  background: var(--color-neptune);
  height: 100%;
  padding: 16px;

  .item {
    display: flex;
    align-items: center;
    padding-left: 8px;
    background-color: #016458;
    width: 100%;
    height: 40px;
    margin: 8px 0 8px 0;
    border-radius: 8px;
  }
}
</style>
