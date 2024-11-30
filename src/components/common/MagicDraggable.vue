<!--
传入的可拖动元素

用法:
<template>
    <MagicDraggable :list="list" :update="update">
        <template #default="{ item }">
            <div @pointerdown="onPointerDown(item.id)" />
              <div>{{ item.name }}</div>
              <div :data-draggable-move="item.id">button</div>
            </div>
        </template>
    </MagicDraggable>
</template>
-->
<script setup lang="ts" generic="T extends { id: ID; [key: string]: any }">
import { reactive } from 'vue';
import { useEventListener } from '@vueuse/core';
import { useCursor } from '@/stores/cursor';
import type { ID } from '@/stores';

interface Props {
  update: (current: T, other: T) => void;
  list: T[];
  handle?: string;
  idAttr?: string;
}

/**
 * props
 * @param update 更新列表
 * @param list 列表
 * @param handle 指定拖拽元素的属性,默认所有元素都可以拖拽
 */
const {
  update,
  handle = 'data-draggable-move',
  list,
  idAttr = 'data-draggable-id'
} = defineProps<Props>();

const cursor = useCursor();

const viewModel = reactive({
  refsMap: new Map<ID, HTMLElement>(),
  start: {
    x: <number>undefined,
    y: <number>undefined
  },
  end: {
    x: <number>undefined,
    y: <number>undefined
  },
  origin: {
    x: <number>undefined,
    y: <number>undefined
  },
  clone: <HTMLElement>undefined, // 拖拽的元素
  target: <HTMLElement>undefined // 点击后选择的元素
});

function setRefs(e: Element, id: ID) {
  e && viewModel.refsMap.set(id, e as HTMLElement);
}

/**
 * 判断点是否在矩形框内
 * @param r1
 * @param x
 * @param y
 */
function collide(r1: DOMRect, x: number, y: number) {
  return !(x < r1.x || x > r1.x + r1.width || y < r1.y || y > r1.y + r1.height);
}

useEventListener(['pointermove'], (e) => {
  if (!viewModel.target || !viewModel.clone) return;
  viewModel.end.x = e.clientX;
  viewModel.end.y = e.clientY;
  viewModel.clone.style.top = `${viewModel.origin.y + viewModel.end.y - viewModel.start.y}px`;
  viewModel.clone.style.left = `${viewModel.origin.x + viewModel.end.x - viewModel.start.x}px`;
  const draggableEl = Array.from(viewModel.refsMap.values())
    .filter((el) => el.getAttribute(idAttr) !== viewModel.target.getAttribute(idAttr))
    .find((el) => {
      const rect = el.getBoundingClientRect();
      return collide(rect, e.clientX, e.clientY);
    });
  if (draggableEl) {
    const sourceId = viewModel.target.getAttribute(idAttr);
    const targetId = draggableEl.getAttribute(idAttr);
    const source = list.find((item) => item.id === sourceId);
    const target = list.find((item) => item.id === targetId);
    update(source as T, target as T);
  }
});

useEventListener(['pointerup', 'pointercancel'], (e) => {
  if (!viewModel.target || !viewModel.clone) return;
  document.body.removeChild(viewModel.clone);
  viewModel.target.style.opacity = '1';
  viewModel.target = null;
  viewModel.clone = null;
  cursor.unlock();
  cursor.setWithUnlock('default');
});

function pointerDown(e: PointerEvent) {
  if (e.button !== 0) {
    // 不是鼠标左键退出
    return;
  }
  const clickEl = e.target as HTMLElement;
  if (!clickEl.hasAttribute(handle)) {
    // 不是拖拽元素退出
    return;
  }
  cursor.lock('move');

  // 记录起始位置
  viewModel.start.x = e.clientX;
  viewModel.start.y = e.clientY;
  viewModel.end.x = e.clientX;
  viewModel.end.y = e.clientY;

  // 获取最底层可拖动元素
  const attrId = clickEl.getAttribute(handle);
  const el = viewModel.refsMap.get(attrId);
  const bound = el.getBoundingClientRect();

  // 记录原始位置
  viewModel.origin.x = bound.left;
  viewModel.origin.y = bound.top;

  // 创建克隆元素
  viewModel.clone = el.cloneNode(true) as HTMLElement;
  viewModel.clone.style.position = 'fixed';
  viewModel.clone.style.top = `${bound.top}px`;
  viewModel.clone.style.left = `${bound.left}px`;
  viewModel.clone.style.width = `${bound.width}px`;
  for (let child of viewModel.clone.children) {
    (<HTMLElement>child).style.boxShadow = '0 0 5px 2px rgba(0, 0, 0, 0.2)';
  }
  document.body.appendChild(viewModel.clone);

  viewModel.target = el;
  el.style.opacity = '0';
}
</script>

<template>
  <div
    v-for="item in list"
    :key="item.id"
    :[idAttr]="item.id"
    :ref="(e) => setRefs(e as Element, item.id)"
    @pointerdown="pointerDown"
  >
    <slot name="default" :item="item" />
  </div>
</template>
