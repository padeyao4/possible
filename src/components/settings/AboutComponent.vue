<script setup lang="ts">
import SettingsItem from './SettingsItem.vue';
import { ref, watchEffect } from 'vue';

const version = ref();

watchEffect(async () => {
  version.value = await window.ipcRenderer.invoke('version');
});
</script>
<template>
  <SettingsItem>
    <template #title>关于</template>
    <template #description>
      <div>当前版本: {{ version }}</div>
      <div>联系方式: guojian_k@qq.com</div>
    </template>
  </SettingsItem>
</template>
