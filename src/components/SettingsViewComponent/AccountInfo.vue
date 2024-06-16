<script setup lang="ts">
import SettingsItem from '@/components/SettingsViewComponent/SettingsItem.vue'
import EButton from '@/components/common/EButton.vue'
import EText from '@/components/common/EText.vue'
import { useAccount } from '@/stores/account'
import { ref } from 'vue'
import LoginModel from './LoginModel.vue'

const account = useAccount()

const logoutLoading = ref()

async function handleLogout() {
  logoutLoading.value = true
  await account.logout()
  logoutLoading.value = false
}

function handleRegister() {
  window.open(import.meta.env.VITE_REGISTER_URL, '_blank')
}

const isDevEenvirment = import.meta.env.VITE_DEV
</script>

<template>
  <SettingsItem>
    <template #title>你的账号</template>
    <template #description>
      <template v-if="account.online"> 当前登录账号为 {{ account.username ?? '未命名' }} </template>
      <template v-else>
        <e-text data-info>你没有登录。使用同步服务、分享信息等都需要你登录账号 </e-text>
        <e-text data-info v-show="isDevEenvirment">
          当前环境为<i>测试环境</i> 测试账号为:<i>user</i>,密码为:<i>user</i>
        </e-text>
      </template>
    </template>
    <template #option>
      <template v-if="account.online">
        <e-button @click="handleLogout" :loading="logoutLoading">退出登录</e-button>
      </template>
      <template v-else>
        <LoginModel />
        <e-button @click="handleRegister">注册</e-button>
      </template>
    </template>
  </SettingsItem>
</template>

<style scoped>
i {
  color: red;
  font-size: 13px;
}
</style>
