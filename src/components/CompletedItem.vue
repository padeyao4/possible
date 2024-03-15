<script setup lang="ts">
import { inject, type Ref } from 'vue'
import { CheckOne } from '@icon-park/vue-next'

const completedTasks = inject<Ref<any[]>>('completedTasks')

</script>
<template>
  <div>
    <div v-for="task in completedTasks" :key="task.id" class="completed-item">
      <div class="item-content">
        <div class="first-line">
          <div class="check-group" @click="task.data.completed=false">
            <CheckOne theme="filled" size="20" fill="#333" :stroke-width="2" stroke-linecap="butt" class="round" />
            <CheckOne theme="outline" size="20" fill="#333" :stroke-width="2" stroke-linecap="butt"
                      class="check" />
          </div>
          <del>{{ task.data.name }}</del>
        </div>
        <div class="second-line">{{ task.data.project.name }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.completed-item {
  display: flex;
  align-items: center;
  padding: 0 16px;
  margin: 4px 0;
  height: 56px;
  border-radius: 4px;
  color: rgba(0, 0, 0, 0.3);
  background: rgba(255, 255, 255, 0.8);

  .item-content {
    flex-grow: 1;

    .first-line {
      display: flex;
      align-items: center;

      .check-group {
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
}
</style>
