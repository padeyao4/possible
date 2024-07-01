<script setup lang="ts">
defineProps<{
  disabled?: boolean
}>()

const checked = defineModel()
</script>
<template>
  <input type="checkbox" v-model="checked" :disabled="disabled" />
</template>
<style scoped>
input[type='checkbox'] {
  position: relative;
  width: 48px;
  height: 24px;
  background-color: #777;
  border-radius: 16px;
  cursor: pointer;
  appearance: none;
}
input[type='checkbox']:before {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  transition: left linear 0.1s;
  content: '';
}
input[type='checkbox']:after {
  display: inline-block;
  color: white;
  font-weight: bold;
  font-size: 12px;
  white-space: nowrap;
  text-indent: 8px;
  word-spacing: 4px;
  content: '开 关';
}

input[type='checkbox']:checked {
  background-color: limegreen;
}
input[type='checkbox']:checked:before {
  left: 26px;
}
input[type='checkbox']:checked:after {
  color: black;
}
</style>
