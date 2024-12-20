<script setup lang="ts">
import { CARD_HEIGHT, type Plan } from '@/stores';
import { computed, ref, watchEffect } from 'vue';

const { height, project } = defineProps<{
  height: number;
  width: number;
  project: Plan;
}>();

const rulers = ref<number[]>([]);

watchEffect(() => {
  const count = Math.ceil(height / CARD_HEIGHT) + 1;
  rulers.value = Array.from({ length: count }, (_, i) => i + 1);
});


const rulerInfo = computed(() => {
  return { translateY: ((project.offsetY ?? 0) % CARD_HEIGHT) - CARD_HEIGHT + 'px', y: Math.floor(Math.abs((project.offsetY ?? 0)) / CARD_HEIGHT) - 2 }
});
</script>

<template>
  <div class="canvas-ruler pl-5">
    <div :style="{ transform: `translateY(${rulerInfo.translateY})` }">
      <div v-for="item in rulers" class="ruler-unit" :key="item" :style="{ height: `${CARD_HEIGHT}px` }">
        {{ item + rulerInfo.y }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.canvas-ruler {
  width: 50px;
  overflow-y: hidden;
  background-color: transparent;
  border-right: 1px solid rgba(27, 31, 35, 0.06);
  pointer-events: none;
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
