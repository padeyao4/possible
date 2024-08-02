<script setup lang="ts">
import SettingsItem from './SettingsItem.vue';
import { ref, watchEffect } from 'vue';

const address = ref('');

watchEffect(async () => {
  address.value = await window.ipcRenderer.invoke('get-path');
});
</script>
<template>
  <SettingsItem>
    <template #title>本地数据存储文件</template>
    <template #description>
      <div>
        <i class="select-text">{{ address }}\config.json</i>
      </div>
      <div>不要修改或者删除当前文件,当前数据存储在此文件中。升级或者迁移前，备份此文件</div>
    </template>
  </SettingsItem>
</template>
