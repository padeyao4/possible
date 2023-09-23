<script lang="ts" setup>
import { useGlobalStore } from '@renderer/store/global'
import router from '@renderer/router'

const store = useGlobalStore()

function handleClick(id: string) {
  router.push({
    name: 'summery',
    replace: true
  })
  store.$patch({ active: id })
}
</script>

<template>
  <div>
    <div class="main">
      <div
        v-for="item in store.projects"
        :key="item.id"
        :class="{ active: item.id === store.active, 'list-item': true }"
        @click="() => handleClick(item.id)"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.main {
  height: calc(100vh - 80px);
  overflow-y: auto;

  .list-item {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 40px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    user-select: none;
  }

  .active {
    background-color: var(--color-neptune);
  }
}

/* 滚动条设置 */
::-webkit-scrollbar {
  width: 3px;
}

::-webkit-scrollbar-track {
  width: 2px;
  background-color: #1c1c1c;
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}

::-webkit-scrollbar-thumb {
  background-color: #9f9f9f;
  background-clip: padding-box;
  min-height: 28px;
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}

::-webkit-scrollbar-thumb:hover {
  width: 6px;
}
</style>
