<script setup lang="ts">
import SettingsItem from '@/components/settings/SettingsItem.vue';
import { useAccountStore } from '@/stores'
const accountStore = useAccountStore()
</script>

<template>
  <SettingsItem>
    <template #title>你的账号</template>
    <template #description>
      当前登录账号为: <i>{{accountStore?.user?.username??"未登录"}}</i>
    </template>
    <template #option>
      <el-button
        :disabled="!accountStore.token"
        style="background-color: #00000000"
        @click="accountStore.logout()"
        >退出登录</el-button
      >
    </template>
  </SettingsItem>
</template>
