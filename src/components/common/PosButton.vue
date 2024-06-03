<script setup lang="ts">
defineProps<{
  background: 'primary' | 'info' | 'warning' | 'error' | 'success',
}>()

const colorMap = {
  primary: '#409eff',
  info: '#f7f7f9',
  warning: '#ffef1e',
  error: '#df393c',
  success: '#62e884'
}
</script>
<template>
  <div class="custom-button" :style="{ backgroundColor: `${colorMap[background]}` }">
    <slot></slot>
  </div>
</template>
<style scoped>
.custom-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 35px;
  border: 1px solid #00000010;
  border-radius: 4px;
}
</style>
