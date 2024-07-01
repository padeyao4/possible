<script setup lang="ts">
import SettingsItem from './SettingsItem.vue';
</script>
<template>
  <SettingsItem>
    <template #title>关于</template>
    <template #description>
      <div class="version">当前版本: 0.3.1</div>
      <div class="version">联系方式: guojian_k@qq.com</div>
    </template>
  </SettingsItem>
</template>
<style scoped>
.version {
  color: #00000090;
  font-size: 13px;
}
</style>
