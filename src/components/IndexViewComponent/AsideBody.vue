<script setup lang="ts">
import { ref } from 'vue';
import Draggable from 'vuedraggable/src/vuedraggable';
import { useProjectStore } from '@/stores/project';
import AsideBodyItem from '@/components/IndexViewComponent/AsideBodyItem.vue';
import { useCursor } from '@/stores/cursor';

const projectStore = useProjectStore();
const draggableRef = ref<{ targetDomElement: Element }>();

function onstart() {
  draggableRef.value.targetDomElement.toggleAttribute('data-show', true);
  const cursor = useCursor();
  cursor.lock('move');
  const els = document.getElementsByClassName('side-list-item');
  for (let el of els) {
    el.toggleAttribute('data-hover', false);
  }
}

function onend(e: any) {
  draggableRef.value.targetDomElement.toggleAttribute('data-show', false);
  const cursor = useCursor();
  cursor.unlock();
  const els = document.getElementsByClassName('side-list-item');
  for (let el of els) {
    el.toggleAttribute('data-hover', true);
  }
  cursor.refresh(e.originalEvent);
}

function onupdate() {
  projectStore.sortProjects.forEach((value, index) => {
    value.sortIndex = index;
  });
}
</script>
<template>
  <draggable
    :list="projectStore.sortProjects"
    class="aside-body"
    ref="draggableRef"
    item-key="id"
    chosenClass="chosen-class"
    dragClass="drag-class"
    handle=".move"
    ghostClass="ghost-class"
    :forceFallback="true"
    animation="300"
    @start="onstart"
    @end="onend"
    @update="onupdate"
  >
    <template #item="{ element }">
      <aside-body-item :project="element" :key="element.id" />
    </template>
  </draggable>
</template>

<style scoped>
.aside-body {
  flex-direction: column;
  width: 100%;
  overflow-y: auto;

  &[data-show]::before {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100vw;
    height: 100vh;
    background-color: #b88230;
    opacity: 0;
    content: '';
  }
}

.ghost-class {
  opacity: 0;
}

.drag-class {
  background: #e5ebef;
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, 0.24) 0 3px 8px;
}

.grabbing * {
  cursor: grabbing !important;
}
</style>
