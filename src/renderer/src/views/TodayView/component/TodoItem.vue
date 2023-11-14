<script setup lang="ts">

import {CheckOne, Drag, Round} from "@icon-park/vue-next";
import {INode, IProject} from "@renderer/model";

defineProps<{
  element: INode,
  projectMap: Map<string, IProject>
}>()

</script>

<template>
  <div class="todo-item">
    <div @click="element.state = 'completed'" class="completed-button">
      <Round theme="outline" size="20" fill="#333" :strokeWidth="2" strokeLinecap="butt" class="round"/>
      <CheckOne theme="outline" size="20" fill="#333" :strokeWidth="2" strokeLinecap="butt" class="check"/>
    </div>
    <div>
      <div>{{ element.name }}</div>
      <div class="project-name">
        {{ projectMap.get(element.projectId)?.name }}
      </div>
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
  height: 56px;
  margin: 4px 0 4px 0;
  border-radius: 4px;

  .project-name {
    color: rgb(0, 0, 0, 0.8);
  }

  &:hover {
    background: rgba(255, 255, 255, 0.7);
  }

  & > :nth-child(2) {
    width: max-content;
    flex-grow: 1;
    text-align: start;
  }

  .completed-button {
    display: flex;
    height: 40px;
    width: 30px;
    padding-top: 0;
    justify-items: center;
    align-items: start;

    .check {
      display: none;
    }

    & > * {
      margin: 0 8px 0 4px;
      color: #b2b4b4;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &:hover .round {
      display: none;
    }

    &:hover .check {
      display: flex;
    }
  }
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
