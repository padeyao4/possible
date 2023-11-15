<script setup lang="ts">

import {computed, onMounted, onUnmounted, ref} from "vue";
import moment from "moment";

const now = ref(new Date())

const timeShow = computed(() => {
  return moment(now.value).format('MM月DD日, 星期d')
})

const interval = ref()

onMounted(() => {
  interval.value = setInterval(() => {
    now.value = new Date()
  }, 1_000)
})

onUnmounted(() => {
  clearInterval(interval.value)
})

</script>

<template>
  <div class="time-pane">
    {{ timeShow }}
  </div>
</template>

<style scoped>
.time-pane {
  display: flex;
  align-items: end;
  height: 32px;
  margin-right: 24px;
  margin-left: 24px;
  font-size: 14px;
  padding-bottom: 6px;
  color: rgba(0, 0, 0, 0.8);
}
</style>
