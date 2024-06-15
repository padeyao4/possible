<script setup lang="ts">
import { Icon } from '@iconify/vue'
</script>
<template>
  <div class="close-icon-button">
    <Icon icon="iconamoon:close-thin" class="icon" />
  </div>
</template>
<style scoped>
.close-icon-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 2px;
}

.close-icon-button:hover {
  background-color: #ff000010;
}

.icon {
  width: 100%;
  height: 100%;
}
</style>
