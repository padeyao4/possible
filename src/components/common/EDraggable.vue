<script setup lang="ts" generic="T extends DraggableType">
import { computed, reactive, ref } from 'vue';
import { useEventListener } from '@vueuse/core';
import type { RectLike } from '@/graph/math';
import type { ID } from '@/core/types';
import type { DraggableType } from '@/components/types';
import { useCursor } from '@/stores/cursor';

/**
 * props
 * @param update 更新列表
 * @param list 列表
 * @param handle 指定拖拽元素的属性,默认所有元素都可以拖拽
 */
const props = defineProps<{
  update: (current: DraggableType, other: DraggableType) => void;
  list: T[];
  handle?: string;
}>();

const { update, handle } = props;

const mapper = computed(() => {
  return new Map(props.list.map((item) => [item.id, item]));
});

const attr = 'data-draggable';

const cursor = useCursor();

const refs = reactive<Map<ID, HTMLElement>>(new Map());

const origin = reactive({ x: 0, y: 0 });
const start = reactive({ x: 0, y: 0 });
const end = reactive({ x: 0, y: 0 });

const target = ref<HTMLElement | null>();
const clone = ref<HTMLElement | null>();

function setAttributeRecursively(element: Element, attributeName: string, attributeValue: string) {
  element.setAttribute(attributeName, attributeValue);
  for (let child of element.children) {
    setAttributeRecursively(child, attributeName, attributeValue);
  }
}

function setRefs(e: any) {
  if (e) {
    const el = e as HTMLElement;
    setAttributeRecursively(el, 'data-draggable', el.id);
    refs.set(el.id, el);
  }
}

function collide(r1: RectLike, x: number, y: number) {
  return !(x < r1.x || x > r1.x + r1.width || y < r1.y || y > r1.y + r1.height);
}

useEventListener(
  ['pointerup', 'pointermove', 'pointercancel'],
  (e: PointerEvent) => {
    if (e.type === 'pointermove') {
      if (target.value && clone.value) {
        end.x = e.clientX;
        end.y = e.clientY;
        clone.value.style.top = `${origin.y + end.y - start.y}px`;
        clone.value.style.left = `${origin.x + end.x - start.x}px`;

        const el = Array.from(refs.values())
          .filter((el) => el.id !== target.value?.id)
          .find((el) => collide(el.getBoundingClientRect(), e.clientX, e.clientY));

        if (el) {
          update(
            mapper.value.get(target.value.getAttribute('data-draggable')),
            mapper.value.get(el.getAttribute('data-draggable'))
          );
        }
      }
    }

    if (e.type === 'pointerup' || e.type === 'pointercancel') {
      if (target.value && clone.value) {
        document.body.removeChild(clone.value);
        target.value.style.opacity = '1';
        target.value = null;
        clone.value = null;
        cursor.unlock();
        cursor.setWithUnlock('default');
      }
    }
  },
  { passive: true }
);

function getAttributeRecursively(element: Element) {
  if (element.hasAttribute(attr)) {
    return element.getAttribute(attr);
  } else {
    return getAttributeRecursively(element.parentElement);
  }
}

function onPointerDown(e: PointerEvent) {
  if (e.button !== 0) return;
  const tmp = e.target as HTMLElement;
  if (handle && !tmp.hasAttribute(handle)) {
    return;
  }
  cursor.lock('move');
  start.x = e.clientX;
  start.y = e.clientY;
  end.x = e.clientX;
  end.y = e.clientY;
  const el = refs.get(getAttributeRecursively(tmp));
  const bound = el.getBoundingClientRect();
  origin.x = bound.left;
  origin.y = bound.top;

  clone.value = el.cloneNode(true) as HTMLElement;
  clone.value.style.position = 'fixed';
  clone.value.style.top = `${bound.top}px`;
  clone.value.style.left = `${bound.left}px`;
  clone.value.style.width = `${bound.width}px`;
  for (let child of clone.value.children) {
    (<HTMLElement>child).style.boxShadow = '0 0 5px 2px rgba(0, 0, 0, 0.2)';
  }
  document.body.appendChild(clone.value);

  target.value = el;

  el.style.opacity = '0';
}
</script>

<template>
  <div
    v-for="item in list"
    :key="item.id"
    :id="item.id"
    :ref="setRefs"
    :data-draggable="item.id"
    @pointerdown="onPointerDown"
  >
    <slot name="default" :item="item" />
  </div>
</template>
