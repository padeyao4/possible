<script setup lang="ts">
import SettingsItem from '@/components/SettingsViewComponent/SettingsItem.vue';
import { $resetPinia, useAccount } from '@/stores';

const account = useAccount();

const logout = async () => {
  await account.logout();
  $resetPinia();
};
</script>

<template>
  <SettingsItem>
    <template #title>你的账号</template>
    <template #description> 当前登录账号为 {{ account.user?.username ?? '未命名' }} </template>
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

<style scoped>
i {
  color: red;
  font-size: 13px;
}
</style>
