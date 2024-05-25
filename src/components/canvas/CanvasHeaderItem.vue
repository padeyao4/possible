<script setup lang="ts">
import { currentProject } from '@/service/project.service'
import { computed } from 'vue'
import { showWeek, timeFormat } from '@/stores/timer'

const props = defineProps<{
  idx: number,
  isToday: boolean
}>()

const project = currentProject()

const date = computed(() => {
  const startTimestamp = project.createTime
  const indexTimestamp = startTimestamp + props.idx * 86400_000
  return new Date(indexTimestamp)
})

const info = computed(() => {
  return timeFormat.format(date.value) + ' ' + showWeek(date.value)
})

</script>

<template>
  <div :class="['time-cell',{'today':isToday}]">
    {{ info }}
  </div>
</template>

<style scoped>
.time-cell {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  font-weight: lighter;
  font-size: 14px;
  border-right: 1px solid #00000010;
}

.today {
  background-color: #95d47570;
}
</style>