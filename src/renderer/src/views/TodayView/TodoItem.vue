<script setup lang="ts">

import {CheckOne, Round, Drag} from "@icon-park/vue-next";
import {IPosNode} from "@renderer/store";
import {ref} from "vue";

defineProps<{
  element: IPosNode
}>()

const components = [
  Round, CheckOne
]

const index = ref(0)

</script>

<template>
  <div class="todo-item">
    <component :is="components[index]" theme="outline" size="20" fill="#333" :strokeWidth="2" strokeLinecap="butt"
               class="icon-park" @click="element.state = 'completed'" @mouseenter="index=1" @mouseleave="index=0"/>
    <div>
      {{ element.name }}
    </div>
    <drag theme="outline" size="20" fill="#333" :strokeWidth="2" class="drag-icon mover"/>
  </div>
</template>

<style scoped>
.todo-item {
  display: flex;
  align-items: center;
  padding-left: 8px;
  text-align: center;
  background: rgba(255, 255, 255, 0.9);
  width: 100%;
  height: 48px;
  margin: 4px 0 4px 0;
  border-radius: 4px;

  &:hover {
    background: rgba(255, 255, 255, 0.7);
  }

  & > :nth-child(2) {
    width: max-content;
    flex-grow: 1;
    text-align: start;
  }
}

.icon-park {
  margin: 0 8px 0 4px;
  color: #b2b4b4;
  display: flex;
  justify-content: center;
  align-items: center;
}

.drag-icon {
  visibility: hidden;
  margin: 0 8px 0 8px;
  color: #b2b4b4;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    cursor: move;
  }
}

.todo-item:hover .drag-icon {
  visibility: visible;
}
</style>
