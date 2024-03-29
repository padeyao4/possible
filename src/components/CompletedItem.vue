<script setup lang="ts">
import { computed, ref } from 'vue'
import { CheckOne } from '@icon-park/vue-next'
import UnfoldButton from '@/components/UnfoldButton.vue'
import { useStore } from '@/stores/store'

const store = useStore()

const isUnfold = ref(false)

const completedTasks = computed(() => {
  return store.currentTasks.filter(node => node.data.completed) ?? []
})

</script>
<template>
  <div>
    <unfold-button v-if="completedTasks.length !== 0" v-model="isUnfold" :counter="completedTasks.length" />
    <template v-if="isUnfold">
      <div v-for="task in completedTasks" :key="task.id" class="completed-item">
        <div class="item-content">
          <div class="first-line">
            <div class="check-group" @click="task.data.completed = false">
              <CheckOne theme="filled" size="20" fill="#333" :stroke-width="2" stroke-linecap="butt" class="round" />
              <CheckOne theme="outline" size="20" fill="#333" :stroke-width="2" stroke-linecap="butt" class="check" />
            </div>
            <del>{{ task.data.name }}</del>
          </div>
          <div class="second-line">{{ store.projects[task.data.projectId].name }}</div>
        </div>
      </div>
    </template>
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
    overflow-x: hidden;

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
      margin: 0 0 0 28px;
      min-width: 0;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow-x: hidden;
    }
  }
}

del {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow-x: hidden;
}
</style>
