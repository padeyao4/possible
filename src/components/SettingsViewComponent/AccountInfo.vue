<script setup lang="ts">
import SettingsItem from '@/components/SettingsViewComponent/SettingsItem.vue'
import { useAccount } from '@/stores/account'
import LoginModel from './LoginModel.vue'
import EButton from '@/components/common/EButton.vue'
import { ref } from 'vue'

const account = useAccount()

const logoutLoading = ref()

async function handleLogout() {
  logoutLoading.value = true
  await account.logout()
  logoutLoading.value = false
}
</script>

<template>
  <SettingsItem>
    <template #title>你的账号</template>
    <template #description>
      <template v-if="account.online"> 当前登录账号为 {{ account.username ?? '未命名' }} </template>
      <template v-else> 你没有登录。使用同步服务、分享信息等都需要你登录账号 </template>
    </template>
    <template #option>
      <template v-if="account.online">
        <e-button @click="handleLogout" :loading="logoutLoading">退出登录</e-button>
      </template>
      <template v-else>
        <LoginModel />
        <e-button>注册</e-button>
      </template>
    </template>
  </SettingsItem>
</template>

<style scoped></style>
