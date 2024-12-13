<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { computed, inject, type Ref, ref } from 'vue';
import type { OptionType } from '@/components/types';

const { x, y, items, parents } = defineProps<{
  items: OptionType[];
  x: number;
  y: number;
  parents: Element[];
}>();

const element = ref<HTMLDivElement>();
const width = 200;
const canvasContainer = inject<Ref<HTMLElement>>('canvasContainer');

const top = computed(() => {
  const canvasContainerBound = canvasContainer.value.getBoundingClientRect();
  const elementBound = element.value?.getBoundingClientRect() ?? { height: 0 };
  return Math.min(y, canvasContainerBound.bottom - elementBound.height);
});

const left = computed(() => {
  const canvasContainerBound = canvasContainer.value.getBoundingClientRect();

  if (parents.length === 0) {
    return Math.min(x, canvasContainerBound.right - width);
  } else {
    return x + width > canvasContainerBound.right ? x - width - parents.length * width : x;
  }
});

const styleLeft = computed(() => {
  return left.value + 'px';
});

const styleTop = computed(() => {
  return top.value + 'px';
});

const styleWidth = computed(() => {
  return width + 'px';
});

const showIndex = ref(-1);

function onmouseenter(i: number, j: number) {
  showIndex.value = count(i, j);
}

function onmouseleave() {
  showIndex.value = -1;
}

function count(i: number, j: number) {
  let n = 0;
  for (let k = 0; k < i; k++) {
    n += items[k].group.length;
  }
  n += j;
  return n;
}

const refs = ref<Element[]>([]);

function setRef(el: Element | undefined) {
  refs.value.push(el);
}

const nextY = computed(() => {
  if (showIndex.value === -1) return 0;
  return refs.value[showIndex.value].getBoundingClientRect().top - 4;
});
</script>

<template>
  <div class="wrapper">
    <div class="contextmenu" @contextmenu.prevent ref="element">
      <div v-for="(group, i) in items" :key="i" class="group">
        <div
          v-for="(value, j) in group.group"
          :key="j"
          class="item-wrapper"
          @click="value.action?.()"
          @mouseenter="() => onmouseenter(i, j)"
          @mouseleave="() => onmouseleave()"
          :ref="setRef"
        >
          <div class="item hover" :data-hover="showIndex === count(i, j)">
            <Icon :icon="value.icon" class="item-icon" />{{ value.title }}
            <Icon
              v-if="value?.children"
              icon="solar:alt-arrow-right-line-duotone"
              class="item-icon"
            />
            <div v-else class="shortcut">{{ value.shortcut }}</div>
          </div>
          <contextmenu-component
            v-if="value?.children && showIndex === count(i, j)"
            :x="left + width"
            :y="nextY"
            :parents="[...parents, element]"
            :items="value.children"
            @mouseenter="() => onmouseenter(i, j)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  position: fixed;
  top: v-bind(styleTop);
  left: v-bind(styleLeft);
  padding: 2px;
  background-color: #ffffff00;
}

.contextmenu {
  z-index: 3;
  flex-direction: column;
  width: v-bind(styleWidth);

  background-color: #ffffff;
  border: 1px solid #00000020;
  border-radius: 5px;
  box-shadow:
    0 0 10px rgba(0, 0, 0, 0.5),
    0 0 20px rgba(247, 247, 249, 0.25);
  animation: fadeIn 200ms ease-in;

  .group {
    border-bottom: 1px solid #33333350;
    &:last-child {
      border-bottom: none;
    }
    .hover[data-hover='true'] {
      background-color: rgba(209, 213, 219, 0.8);
    }
    .item-wrapper {
      &:first-child {
        padding-top: 4px;
      }
      &:last-child {
        padding-bottom: 4px;
      }
      padding: 0 4px;
      .item {
        display: flex;
        align-items: center;
        justify-content: start;
        height: 25px;
        border-radius: 4px;
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
