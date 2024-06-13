<script setup lang="ts">
import AccountInfoComponent from '@/components/SettingsViewComponent/AccountInfoComponent.vue'
import { useRoute } from '@/stores/route'

const { back } = useRoute()
</script>
<template>
  <div class="login">
    <header>
      <my-icon icon="solar:arrow-left-linear" class="back-button" @click="back()" /> 设置
    </header>
    <main>
      <div class="container">
        <div class="item">
          <AccountInfoComponent />
        </div>
      </div>
    </main>
  </div>
</template>
<style scoped>
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: var(--background-bottom-color);

  header {
    display: flex;
    align-items: center;
    width: 100%;
    height: 64px;
    margin-top: 12px;
    font-size: 24px;
    border-bottom: var(--border-default-style);

    .back-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      margin: 8px;
      padding: 4px;

      &:hover {
        background-color: var(--background-top-color);
      }
    }
  }

  main {
    display: flex;
    justify-content: center;
    width: 100%;
    height: calc(100vh - 64px);
    overflow-y: auto;

    .container {
      display: flex;
      flex-direction: column;
      width: 550px;
      height: 100%;
    }
  }
}

.item {
  background-color: aquamarine;
  border-bottom: 1px solid #00000030;
}
</style>
