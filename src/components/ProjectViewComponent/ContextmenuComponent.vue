<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { computed, ref } from 'vue';
import type { OptionType } from '@/components/types';
import { clampMax } from '@/graph/math';

const { x, y, canvas } = defineProps<{
  items: OptionType[];
  x: number;
  y: number;
  canvas: Element;
  parents?: Element[];
}>();

const element = ref<HTMLDivElement>();

const top = computed(() => {
  const canvasBound = canvas.getBoundingClientRect();
  const elementBound = element.value?.getBoundingClientRect();
  return clampMax(y, canvasBound.bottom - elementBound.height) + 'px';
});

const left = computed(() => {
  const canvasBound = canvas.getBoundingClientRect();
  const elementBound = element.value?.getBoundingClientRect();
  return clampMax(x, canvasBound.right - elementBound.width) + 'px';
});
</script>

<template>
  <div class="contextmenu" @contextmenu.prevent ref="element">
    <div v-for="(group, i) in items" :key="i" class="group">
      <div v-for="(value, j) in group.group" :key="j" class="item" @click="value.action?.()">
        <Icon :icon="value.icon" class="item-icon" />{{ value.title }}
        <Icon v-if="value?.children" icon="solar:alt-arrow-right-line-duotone" class="item-icon" />
        <div v-else class="shortcut">{{ value.shortcut }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.contextmenu {
  position: fixed;
  top: v-bind(top);
  left: v-bind(left);
  z-index: 3;
  flex-direction: column;
  width: 200px;
  background-color: var(--background-middle-color);
  border: 1px solid #00000020;
  border-radius: 5px;
  box-shadow:
    0 0 10px rgba(0, 0, 0, 0.5),
    0 0 20px rgba(247, 247, 249, 0.25);
  animation: fadeIn 200ms ease-in;

  .group {
    padding: 4px;
    border-bottom: 1px solid #33333350;
    &:last-child {
      border-bottom: none;
    }
    .item {
      display: flex;
      align-items: center;
      justify-content: start;
      height: 25px;
      border-radius: 4px;
      &:hover {
        background-color: var(--background-active-color);
      }
      .item-icon {
        width: 20px;
        height: 20px;
        margin: 0 8px;
      }
      .shortcut {
        margin: 0 8px;
        color: #00000070;
      }
      & > *:last-child {
        margin-left: auto;
      }
    }
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>
