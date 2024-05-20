<script setup>
import { linkTo } from '@/stores/service/route.service'

function handleBack() {
  linkTo('/')
}
</script>
<template>
  <div class="settings">
    <header>
      <my-icon icon="solar:arrow-left-linear" class="back-button" @click="handleBack" /> 设置
    </header>
    <main>
      <div>
        <h3>暂无内容</h3>
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
    justify-content: center;
    width: 550px;
  }
}
</style>
