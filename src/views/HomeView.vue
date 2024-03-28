<script setup lang="ts">
import { useStore } from '@/stores/store'
import { computed } from 'vue'
import { showWeek } from '@/utils/time'
import TodoItem from '@/components/TodoItem.vue'
import CompletedItem from '@/components/CompletedItem.vue'

const store = useStore()

const timeFormat = new Intl.DateTimeFormat('zh-Hans')

const todayTime = computed(() => (
    timeFormat.format(store.currentTime) + ',' + showWeek(store.currentTime)
  )
)

</script>

<template>
  <div id="home-view">
    <header data-tauri-drag-region>
      <div data-tauri-drag-region>我的一天</div>
      <div data-tauri-drag-region>{{ todayTime }}</div>
    </header>
    <main>
      <todo-item />
      <completed-item />
    </main>
  </div>
</template>

<style scoped>
#home-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: #82bbb5;
  overflow: hidden;
}

header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 58px;
  flex-shrink: 0;
  margin: 24px 24px 12px 24px;
  overflow-y: hidden;

  & > * {
    display: flex;
    align-items: center;
  }

  & div:first-child {
    font-size: 20px;
  }

  & div:nth-child(2) {
    font-size: 14px;
    font-weight: 1;
    color: rgba(0, 0, 0, 0.8);
  }
}

main {
  padding: 12px 24px 24px 24px;
  height: calc(100vh - 24px * 3 - 58px);
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
