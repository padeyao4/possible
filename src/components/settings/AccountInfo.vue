<script setup lang="ts">
import SettingsItem from '@/components/settings/SettingsItem.vue';
import { $resetPinia, useAccount } from '@/stores';
import { saveAll } from '@/utils';

const account = useAccount();

const logout = async () => {
  await saveAll();
  await account.logout();
  $resetPinia();
};
</script>

<template>
  <SettingsItem>
    <template #title>你的账号</template>
    <template #description>
      当前登录账号为: <i>{{ account.user?.username ?? '本地账号' }}</i>
    </template>
    <template #option>
      <el-button
        @click="logout"
        :loading="account.logoutLoading"
        style="background-color: #00000000"
        >退出登录</el-button
      >
    </template>
  </SettingsItem>
</template>
