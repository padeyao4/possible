<script setup lang="ts">
import AccountInfo from '@/components/SettingsViewComponent/AccountInfo.vue';
import SyncSettingsComponent from '@/components/SettingsViewComponent/SyncSettingsComponent.vue';
import { useRoute } from '@/stores/route';

const { back } = useRoute()
</script>
<template>
  <div class="settings">
    <header>
      <my-icon icon="solar:arrow-left-linear" class="back-button" @click="back()" /> 设置
    </header>
    <div class="container">
      <AccountInfo />
      <SyncSettingsComponent />
    </div>
  </div>
</template>
<style scoped>
.settings {
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

  .container {
    display: flex;
    flex-direction: column;
    width: 550px;
    height: 100%;
    margin-right: auto;
    margin-left: auto;
  }
}
</style>
