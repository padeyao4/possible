<script setup lang="ts">
import SettingsItem from '@/components/SettingsViewComponent/SettingsItem.vue'
import { useAccount } from '@/stores/account'
import LoginModel from './LoginModel.vue'

const accout = useAccount()
</script>

<template>
  <SettingsItem>
    <template #title>你的账号</template>
    <template #description>
      <template v-if="accout.online"> 当前登录账号为 {{ accout.username ?? '未命名' }} </template>
      <template v-else>
        你没有登录。使用同步服务、分享信息等都需要你登录账号
      </template>
    </template>
    <template #option>
      <template v-if="accout.online">
        <div class="button" @click="accout.logout">退出登录</div>
      </template>
      <template v-else>
        <LoginModel />
        <div class="button">注册</div>
      </template>
    </template>
  </SettingsItem>
</template>

<style scoped>
.button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  color: #00000090;
  border: 1px solid #00000050;
  border-radius: 4px;
}
</style>
