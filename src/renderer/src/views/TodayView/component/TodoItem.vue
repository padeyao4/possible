<script setup lang="ts">
import { CheckOne, Drag, Round } from '@icon-park/vue-next'
import router from '@renderer/router'
import { useStore } from '@renderer/store'
import { PNode } from '@renderer/model'

defineProps<{
  element: PNode
}>()

const store = useStore()

function handleClick(projectId: string) {
  router.push({
    path: `/project/${projectId}`,
    replace: true
  })
}
</script>

<template>
  <div class="todo-item">
    <div class="completed-button" @click="element.state = 'completed'">
      <Round
        theme="outline"
        size="20"
        fill="#333"
        :stroke-width="2"
        stroke-linecap="butt"
        class="round"
      />
      <CheckOne
        theme="outline"
        size="20"
        fill="#333"
        :stroke-width="2"
        stroke-linecap="butt"
        class="check"
      />
    </div>
    <div>
      <div>{{ element.name }}</div>
      <div
        class="project-name"
        @click="
          () => {
            handleClick(element.projectId)
          }
        "
      >
        {{ store.projects.get(element.projectId)?.name }}
      </div>
    </div>
    <drag theme="outline" size="20" fill="#333" :stroke-width="2" class="drag-icon mover" />
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
    cursor: pointer;
    width: max-content;
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
