<script setup lang="ts">
import { Icon } from '@iconify/vue';

defineProps<{
  count: number;
}>();

const visible = defineModel();
</script>

<template>
  <div class="counter-button" @click="visible = !visible">
    <Icon :icon="visible ? 'solar:alt-arrow-down-bold' : 'solar:alt-arrow-right-bold'" />
    已完成 {{ count }}
  </div>
</template>

<style scoped>
.counter-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: max-content;
  height: 32px;
  padding: 0 8px;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  user-select: none;
}
</style>
