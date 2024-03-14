<script setup lang="ts">
import { useStore } from '@/stores/store'
import { computed, ref } from 'vue'
import UnfoldButton from '@/components/UnfoldButton.vue'

const store = useStore()

const isUnfold = ref(false)

const isEmpty = computed(() => {
  return Object.values(store.projects).length === 0
})
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
          <div>工作列表</div>
          <unfold-button v-model="isUnfold" />
          <div v-if="isUnfold">完成工作列表</div>
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
  background: #f7f7f9;
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
