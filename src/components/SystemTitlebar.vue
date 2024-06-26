<script setup lang="ts">
import { useSettings } from '@/stores/settings';
import { computed } from 'vue';

const settings = useSettings();

const side = computed(() => {
  return settings.sideWidth + 'px';
});
</script>

<template>
  <div class="title-bar">
    <div class="one drag-region"></div>
    <div class="two drag-region"></div>
    <div class="system-button"></div>
  </div>
</template>

<style scoped>
.title-bar {
  position: fixed;
  top: 0;
  z-index: 9999;
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 35px;
  pointer-events: none;
}

.one {
  width: v-bind(side);
  height: 15px;
}

.two {
  flex: 1;
  height: 100%;
}

.drag-region {
  user-select: none;
  -webkit-app-region: drag;
}

.system-button {
  width: 137px;
  height: 100%;
}
</style>
