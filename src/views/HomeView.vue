<script setup lang="ts">
import { useStore } from '@/stores/store'
import { computed, provide, ref } from 'vue'
import UnfoldButton from '@/components/UnfoldButton.vue'
import { dateToX } from '@/utils/time'
import TodoItem from '@/components/TodoItem.vue'
import CompletedItem from '@/components/CompletedItem.vue'

const store = useStore()

const isUnfold = ref(false)

const isEmpty = computed(() => {
  return Object.values(store.projects).length === 0
})

const completedTasks = computed(() => {
  return Object.values(store.projects)
    .filter(project => !project.completed)
    .map(project => project.nodes.filter(node => node.data.x === dateToX(store.currentTime, project.createTime)))
    .flat()
    .filter(node => node.data.completed)
})

provide('tasks',completedTasks)
</script>

<template>
  <div>
    <main>
      <div class="content">
        <header>
          <div id="main-title">我的一天</div>
          <div id="sub-title">2024/3/14,星期四</div>
        </header>
        <section v-if="isEmpty">
          <h1>empty</h1>
        </section>
        <section v-else>
          <todo-item />
          <unfold-button v-model="isUnfold" :counter="completedTasks.length" />
          <template v-if="isUnfold">
            <completed-item />
          </template>
        </section>
      </div>
      <footer>
        <div>添加子任务</div>
      </footer>
    </main>
  </div>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #82bbb5;
}

.content {
  flex-grow: 1;
  padding: 24px 24px 0 24px;
  box-shadow: rgba(27, 31, 35, 0.06) 0 1px 0,
  rgba(255, 255, 255, 0.25) 0 1px 0 inset;
}

footer {
  height: 48px;
  flex-shrink: 0;
}


header {
  height: 64px;
  flex-shrink: 0;
}

section {
  flex-grow: 1;
}


#main-title {
  display: flex;
  align-items: center;
  font-size: 20px;
}

#sub-title {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 1;
  color: rgba(0, 0, 0, 0.8);
}
</style>
