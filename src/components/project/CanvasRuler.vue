<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import { useWindowSize } from '@vueuse/core';
import { useDataStore } from '@/stores';

const graph = useDataStore();
const project = graph.project;

const rulers = ref<number[]>([]);

const { height } = useWindowSize();

watchEffect(() => {
  const count = Math.ceil(height.value / graph.cardHeight);
  rulers.value = Array.from({ length: count }, (_, i) => i + 1);
});

const y = computed(() => {
  const absY = Math.abs(project.y);
  return Math.floor(absY / graph.cardHeight) - 2;
});

const translateY = computed(() => (project.y % graph.cardHeight) - graph.cardHeight + 'px');
</script>

<template>
  <div class="canvas-ruler">
    <div class="container">
      <div
        v-for="item in rulers"
        class="ruler-unit"
        :key="item"
        :style="{ height: `${graph.cardHeight}px` }"
      >
        {{ item + y }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.canvas-ruler {
  width: 40px;
  padding-left: 16px;
  overflow-y: hidden;
  background-color: transparent;
  border-right: 1px solid rgba(27, 31, 35, 0.06);
  pointer-events: none;
}

.container {
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
