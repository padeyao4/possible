<script setup lang="ts">
import { useSettings } from '@/stores/settings'
import { onMounted, watchEffect } from 'vue'
import { linkTo } from '@/stores/service/route-service'

const settings = useSettings()

function onclick(e: MouseEvent) {
  const el = e.target as HTMLElement
  const key = el.getAttribute('data-path')
  if (key !== null) {
    linkTo('/' + key)
  }
}

</script>

<template>
  <div id="aside-header" @click="onclick">
    <div class="side-list-item" data-path="today">我的一天</div>
    <div class="side-list-item" data-path="backlog">备忘录</div>
    <div class="side-list-item" data-path="manage">任务管理</div>
  </div>
</template>

<style scoped>
#aside-header {
  box-shadow: rgba(27, 31, 35, 0.06) 0 1px 0,
  rgba(255, 255, 255, 0.25) 0 1px 0 inset;

  & > * {
    display: flex;
    align-items: center;
    height: 40px;
    padding: 4px;
    margin: 4px;
    user-select: none;
  }
}
</style>