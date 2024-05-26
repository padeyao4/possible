<script setup>
import { useRoute } from '@/stores/route'
import { isTauri, useInvoke } from '@/tauri-util'
import { computed } from 'vue'

const route = useRoute()

function handleBack() {
  route.back()
}

const dataPath = computed(() => {
  return isTauri() ? useInvoke('get_base_path') : '临时数据'
})
</script>
<template>
  <div class="settings">
    <header>
      <my-icon icon="solar:arrow-left-linear" class="back-button" @click="handleBack" /> 设置
    </header>
    <main>
      <div class="item">
        <div>本地数据存储地址</div>
        <div class="description">{{ dataPath }}</div>
      </div>
      <div class="item">
        <div>远程数据</div>
        <div>使用git同步</div>
        <div>地址</div>
        <div>认证方式 (password/ssh key)</div>
        <div>同步方式 (手动/自动)</div>
        <div>同步周期</div>
      </div>
    </main>
  </div>
</template>
<style scoped>
.settings {
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #1a1b1c;
  color: #d9d9d9;

  header {
    display: flex;
    align-items: center;
    width: 100%;
    height: 64px;
    margin-top: 12px;
    font-size: 24px;
    border-bottom: 1px solid #ffffff40;
    .back-button {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 40px;
      height: 40px;
      margin: 8px;
      padding: 4px;
      &:hover {
        background-color: #ffffff20;
      }
    }
  }

  main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 550px;

    & > *:first-child {
      margin-top: 12px;
    }

    .item {
      display: flex;
      flex-direction: column;
      margin-bottom: 12px;
      margin-left: 0;
      margin-right: 0;
      padding: 8px 0;
      width: 100%;
      border-bottom: 1px solid #ffffff30;
      & > * {
        margin: 4px 0;
        padding: 8px 0;
      }
      input {
        outline-style: none;
        background-color: #2a2a2a;
        color: #d9d9d9;
        border: 1px solid #ffffff30;
        border-radius: 4px;
        padding: 8px;
      }
      .description {
        border: 1px solid #ffffff30;
        border-radius: 4px;
        background-color: #2a2a2a;
        color: #d9d9d9;
        user-select: text;
        padding: 8px;
      }
    }
  }
}
</style>
