<script setup lang="ts">
import AccountInfo from '@/components/SettingsViewComponent/AccountInfo.vue';
import AboutComponent from '@/components/SettingsViewComponent/AboutComponent.vue';
import { Back } from '@element-plus/icons-vue';
</script>
<template>
  <div class="settings">
    <header>
      <el-icon @click="$router.back()" class="back-button" :size="30"><Back /></el-icon>
      设置
    </header>
    <div class="container">
      <AccountInfo />
      <AboutComponent />
    </div>
  </div>
</template>
<style scoped>
.settings {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--background-bottom-color);

  header {
    display: flex;
    align-items: center;
    width: 100%;
    height: 64px;
    font-size: 24px;
    border-bottom: var(--border-default-style);
    -webkit-app-region: drag;

    .back-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      margin: 8px;
      padding: 4px;
      -webkit-app-region: no-drag;

      &:hover {
        background-color: var(--background-top-color);
      }
    }
  }

  .container {
    display: grid;
    flex-direction: column;
    grid-template-rows: min-content;
    width: 550px;
    height: 100%;
    margin-right: auto;
    margin-left: auto;
  }
}
</style>
