<script setup lang="ts">
defineProps<{
  count: number;
}>();
</script>

<template>
  <div class="count-label" v-show="count > 0">{{ count }}</div>
</template>

<style scoped>
.count-label {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin-right: 4px;
  color: #000000;
  font-weight: 600;
  font-size: 12px;
  background-color: #00000015;
  border-radius: 50%;
}
</style>
