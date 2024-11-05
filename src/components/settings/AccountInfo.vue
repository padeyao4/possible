<script setup lang="ts">
import SettingsItem from '@/components/settings/SettingsItem.vue';
</script>

<template>
  <SettingsItem>
    <template #title>你的账号</template>
    <template #description>
      当前登录账号为: <i> 本地账号</i>
    </template>
    <template #option>
      <el-button
        disabled
        style="background-color: #00000000"
        >退出登录</el-button
      >
    </template>
  </SettingsItem>
</template>
