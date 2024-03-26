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
    <div class="content">
      <header>
        <div id="main-title">我的一天</div>
        <div id="sub-title">{{ todayTime }}</div>
      </header>
      <section>
        <todo-item />
        <completed-item />
      </section>
    </div>
    <footer>
    </footer>
  </div>
</template>

<style scoped>
#home-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: #82bbb5;
}

.content {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 24px 24px 0 24px;
  height: calc(100vh - 48px);
}

footer {
  height: 48px;
  box-shadow: rgba(27, 31, 35, 0.06) 0 -1px 0,
  rgba(255, 255, 255, 0.25) 0 -1px 0 inset;
}

header {
  height: 64px;
  flex-shrink: 0;
}

section {
  flex-grow: 1;
  overflow-y: auto;
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
