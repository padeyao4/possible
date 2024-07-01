<script setup lang="ts">
import TheSide from '@/components/LayoutSide/TheSide.vue';
import TheSeparation from '@/components/common/TheSeparation.vue';
import { useSettings } from '@/stores/settings';
import { computed } from 'vue';

const settings = useSettings();
const width = computed(() => settings.sideWidth + 'px');
</script>

<template>
  <div class="container">
    <the-side class="side" />
    <router-view :key="$route.fullPath" class="main" />
    <the-separation />
  </div>
</template>

<style scoped>
.container {
  position: relative;
  display: flex;
  flex-direction: row;
  background-color: var(--background-bottom-color);
}

.side {
  width: v-bind(width);
}

.main {
  width: calc(100vw - v-bind(width));
  overflow: hidden;
  background-color: var(--background-middle-color);
  border-top: 1px solid #00000020;
  border-left: 1px solid #00000020;
  border-radius: 8px 0 0 0;
}
</style>
