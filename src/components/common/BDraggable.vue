<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { useEventListener } from '@vueuse/core';

const list = defineModel();
const refs = reactive<HTMLElement[]>([]);

const origin = reactive({ x: 0, y: 0 });
const start = reactive({ x: 0, y: 0 });
const end = reactive({ x: 0, y: 0 });

const target = ref<HTMLElement | null>();
const clone = ref<HTMLElement | null>();

function setRefs(e: any) {
  console.dir(e);
  if (e) {
    const el = e as HTMLElement;
    el.toggleAttribute('data-draggable', true);
    refs.push(el);
  }
}

useEventListener(
  ['pointerdown', 'pointerup', 'pointermove', 'pointercancel'],
  (e: PointerEvent) => {
    if (e.type === 'pointerdown') {
      const el = e.target as HTMLElement;
      if (el.getAttribute('data-draggable')) {
        e.preventDefault();
        start.x = e.clientX;
        start.y = e.clientY;
        end.x = e.clientX;
        end.y = e.clientY;
        const bound = el.getBoundingClientRect();
        origin.x = bound.left;
        origin.y = bound.top;

        clone.value = el.cloneNode(true) as HTMLElement;
        clone.value.style.position = 'absolute';
        clone.value.style.top = `${bound.top}px`;
        clone.value.style.left = `${bound.left}px`;
        clone.value.style.width = `${bound.width}px`;
        document.body.appendChild(clone.value);

        el.style.opacity = '0';
      }
    }

    if (e.type === 'pointermove') {
      if (target.value && clone.value) {
        end.x = e.clientX;
        end.y = e.clientY;
        clone.value.style.top = `${origin.y + end.y - start.y}px`;
        clone.value.style.left = `${origin.x + end.x - start.x}px`;
      }
    }

    if (e.type === 'pointerup' || e.type === 'pointercancel') {
      if (target.value && clone.value) {
        target.value = null;
        clone.value = null;
      }
    }
  }
);
</script>

<template>
  <div>
    <slot :setRefs="setRefs"></slot>
  </div>
</template>

<style scoped></style>
