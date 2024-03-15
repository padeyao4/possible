<script setup lang="ts">
import { computed } from 'vue'
import { dateToX } from '@/utils/time'
import { useStore } from '@/stores/store'
import { CheckOne, Drag, Round } from '@icon-park/vue-next'

const store = useStore()

const tasks = computed(() => {
  return Object.values(store.projects)
    .filter(project => !project.completed)
    .map(project => project.nodes.filter(node => node.data.x === dateToX(store.currentTime, project.createTime)))
    .flat()
    .filter(node => !node.data.completed)
})

</script>
<template>
  <div>
    <div v-for="task in tasks" :key="task.id" class="todo-item">
      <div class="item-content">
        <div class="first-line">
          <div class="todo-check-group" @click="task.data.completed=true">
            <Round theme="outline" size="20" fill="#333" :stroke-width="2" stroke-linecap="butt" class="round" />
            <CheckOne theme="outline" size="20" fill="#333" :stroke-width="2" stroke-linecap="butt"
                      class="check" />
          </div>
          {{ task.data.name }}
        </div>
        <div class="second-line">baba</div>
      </div>
      <Drag theme="outline" size="20" fill="#333" :stroke-width="2" class="move-bar" />
    </div>
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
  background: rgba(255, 255, 255, 0.8);

  .item-content {
    flex-grow: 1;

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
      display: flex;
      align-items: center;
      margin: 0 0 0 28px;
    }
  }

  .move-bar {
    display: none;
    align-items: center;
    justify-content: end;
    width: 32px;
    height: 48px;
    flex-shrink: 0;
    cursor: move;
  }

  &:hover .move-bar {
    display: flex;
  }
}
</style>
