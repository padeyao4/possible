<script setup lang="ts">
import { linkTo } from '@/stores/service/route.service';
import { useSettings } from '@/stores/settings';

const settings = useSettings()

function onclick(path: string) {
  setTimeout(() => {
    linkTo(path)
  })
}
</script>

<template>
  <div id="aside-header">
    <div
      class="side-list-item"
      :data-active="settings.active === 'today'"
      data-hover
      @click="onclick('/today')"
    >
      <my-icon icon="solar:sun-2-broken" class="side-icon" />
      <div class="side-item-text">我的一天</div>
    </div>
    <div
      class="side-list-item"
      :data-active="settings.active === 'backlog'"
      data-hover
      @click="onclick('/backlog')"
    >
      <my-icon icon="solar:pallete-2-broken" class="side-icon" />
      <div class="side-item-text">备忘录</div>
    </div>
    <div
      class="side-list-item"
      :data-active="settings.active === 'manage'"
      data-hover
      @click="onclick('/manage')"
    >
      <my-icon icon="solar:checklist-minimalistic-broken" class="side-icon" />
      <div class="side-item-text">任务管理</div>
    </div>
  </div>
</template>

<style scoped>
#aside-header {
  box-shadow:
    rgba(27, 31, 35, 0.06) 0 1px 0,
    rgba(255, 255, 255, 0.25) 0 1px 0 inset;
  margin-top: 24px;

  & > * {
    display: flex;
    align-items: center;
    height: 40px;
    padding: 4px;
    margin: 4px 12px;
    user-select: none;
  }

  .my-icons {
    & > *:first-child {
      width: 20px;
      height: 20px;
    }
  }
}
</style>
