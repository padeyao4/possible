<script setup lang="ts">
import { useSettings } from '@/stores/settings'
import { onMounted, watchEffect } from 'vue'
import { linkTo } from '@/stores/service/route-service'

const settings = useSettings()

onMounted(() => {
  watchEffect(() => {
    const root = document.getElementById('aside-header')
    const els = root.children
    for (let el of els) {
      const eq = el.getAttribute('data-key') === settings.active
      el.toggleAttribute('active', eq)
    }
  })
})

function onclick(e: MouseEvent) {
  const el = e.target as HTMLElement
  const key = el.getAttribute('data-key')
  if (key !== null) {
    linkTo(key)
  }
}

</script>

<template>
  <div id="aside-header" @click="onclick">
    <div data-key="/today">我的一天</div>
    <div data-key="/backlog">备忘录</div>
    <div data-key="/manage">任务管理</div>
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

    &:hover {
      background: #529b2e;
      border-radius: 4px;
    }

    &[active] {
      background: #529b2e;
      border-radius: 4px;
    }
  }
}
</style>