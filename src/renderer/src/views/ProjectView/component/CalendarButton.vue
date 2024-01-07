<script setup lang="ts">
import { ref } from 'vue'
import { DAY_OF_MS } from '@renderer/common/constant'

const props = defineProps<{
  callback: Function
}>()

const date = ref()

function handleBlur(e: any) {
  e.target.blur()
}

function handleGraph() {
  if (!date.value) return
  props.callback?.(new Date(date.value).getTime() + DAY_OF_MS)
}
</script>

<template>
  <el-date-picker
    v-model="date"
    style="width: 120px; margin: 0 4px 0 4px; user-select: none"
    type="date"
    placeholder="Pick a day"
    size="small"
    @keydown.enter="(e) => handleBlur(e)"
    @blur="handleGraph"
  />
</template>

<style scoped></style>
