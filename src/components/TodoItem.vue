<script setup lang="ts">
import { computed } from 'vue'
import { CheckOne, Drag, Round } from '@icon-park/vue-next'
import Draggable from 'vuedraggable'
import { useStore } from '@/stores/store'
import { setDragCursor } from '@/utils/other-utils'

const store = useStore()

const todoTasks = computed(() => {
  return [...store.currentTasks].sort((task1, task2) => task1.data.sortedIndex - task2.data.sortedIndex)
    .filter(node => !node.data.completed) ?? []
})

function onUpdate() {
  todoTasks?.value.forEach((value, index) => {
    value.data.sortedIndex = index
  })
}


function onDragStart() {
  setDragCursor(true)
  const elements = document.getElementsByClassName('todo-item')
  for (let element of elements) {
    element.classList.remove('item-hover')
  }
}

function onDragEnd() {
  setDragCursor(false)
  const elements = document.getElementsByClassName('todo-item')
  for (let element of elements) {
    element.classList.add('item-hover')
  }
}

</script>
<template>
  <div>
    <draggable :list="todoTasks"
               item-key="id"
               chosenClass="chosen-class"
               dragClass="drag-class"
               handle=".move"
               ghostClass="ghost-class"
               :forceFallback="true"
               animation="300"
               @end="onDragEnd"
               @start="onDragStart"
               @update="onUpdate">
      <template #item="{ element }">
        <div :key="element.id" class="todo-item item-hover">
          <div class="item-content">
            <div class="first-line">
              <div class="todo-check-group" @click="element.data.completed=true">
                <Round theme="outline" size="20" fill="#333" :stroke-width="2" stroke-linecap="butt" class="round" />
                <CheckOne theme="outline" size="20" fill="#333" :stroke-width="2" stroke-linecap="butt"
                          class="check" />
              </div>
              <div class="info">
                {{ element.data.name }}
              </div>
            </div>
            <div class="second-line">{{ store.projects[element.data.projectId].name }}</div>
          </div>
          <Drag theme="outline" size="20" fill="#333" :stroke-width="2" class="move move-bar" />
        </div>
      </template>
    </draggable>
  </div>
</template>

<style scoped>
.todo-item {
  display: flex;
  align-items: center;
  padding: 0 16px;
  margin: 4px 0;
  height: 56px;
  border-radius: 4px;
  overflow-x: hidden;
  background: rgba(255, 255, 255, 0.8);

  .item-content {
    flex-grow: 1;
    overflow: hidden;

    .first-line {
      display: flex;
      align-items: center;

      .todo-check-group {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 8px 0 0;

        & > * {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .check {
          display: none;
        }

        &:hover .round {
          display: none;
        }

        &:hover .check {
          display: flex;
        }
      }
    }

    .second-line {
      font-weight: 250;
      margin: 0 0 0 28px;
      overflow-x: hidden;
      min-width: 0;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .move-bar {
    display: none;
    align-items: center;
    justify-content: end;
    width: 32px;
    height: 48px;
    flex-shrink: 0;
    cursor: grab;
  }
}

.item-hover {
  &:hover .move-bar {
    display: flex;
  }
}

.info {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow-x: hidden;
}
</style>
