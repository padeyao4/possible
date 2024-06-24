<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import { useWindowSize } from '@vueuse/core';
import { useSettings } from '@/stores/settings';
import { currentProject } from '@/service/project.service';

const project = currentProject();
const settings = useSettings();

const rulers = ref<number[]>([]);

const { height } = useWindowSize();

watchEffect(() => {
  const count = Math.ceil(height.value / settings.unitHeight);
  rulers.value = Array.from({ length: count }, (_, i) => i + 1);
});

const y = computed(() => {
  const absY = Math.abs(project.offset.y);
  return Math.floor(absY / settings.unitHeight) - 2;
});

const translateY = computed(
  () => (project.offset.y % settings.unitHeight) - settings.unitHeight + 'px'
);
</script>

<template>
  <div class="canvas-ruler">
    <div class="container">
      <div
        v-for="item in rulers"
        class="ruler-unit"
        :key="item"
        :style="{ height: `${settings.unitHeight}px` }"
      >
        {{ item + y }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.canvas-ruler {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 40px;
  padding-left: 16px;
  overflow-y: hidden;
  background-color: transparent;
  border-right: 1px solid rgba(27, 31, 35, 0.06);
  clip-path: polygon(0 40px, 40px 40px, 40px 100%, 0 100%);
  pointer-events: none;
}

.container {
  height: calc(100% - 40px);
  margin-top: 40px;
  transform: translateY(v-bind(translateY));
}

.ruler-unit {
  display: flex;
  align-items: center;
  justify-content: start;
  overflow: hidden;
  font-weight: lighter;
  border-bottom: #00000010 solid 1px;
}
</style>
