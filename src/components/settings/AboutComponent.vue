<script setup lang="ts">
import { onMounted, ref } from 'vue';
import SettingsItem from './SettingsItem.vue';
import { InfoControllerApi } from '@/openapi';

const version = import.meta.env.VITE_APP_VERSION;
const author = import.meta.env.VITE_APP_AUTHOR;

const backendVersion = ref('')

onMounted(() => {
  new InfoControllerApi().version().then(res => {
    backendVersion.value = res.data.payload!
  })
})

</script>
<template>
  <SettingsItem>
    <template #title>关于</template>
    <template #description>
      <div>当前版本: {{ version }}-{{ backendVersion }}</div>
      <div>联系方式: {{ author }}</div>
    </template>
  </SettingsItem>
</template>
