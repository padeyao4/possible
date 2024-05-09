<script setup lang="ts">

</script>

<template>
  <div id="aside-header">
    <div>我的一天</div>
    <div>备忘录</div>
    <div>任务管理</div>
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
  }
}
</style>