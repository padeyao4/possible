<script setup lang="ts">
import { useAccount } from '@/stores/account'
import LoginComponent from './LoginComponent.vue'
import $bus from '@/lib/bus'

const account = useAccount()

function openLogin() {
  $bus.emit('login', { visible: true })
}
</script>

<template>
  <div v-if="account.online">模板</div>
  <div>
    <div>
      <button @click="openLogin">登录</button>
      <button @click="() => {}">注册</button>
    </div>
    <teleport to="body">
      <LoginComponent />
    </teleport>
  </div>
</template>

<style scoped></style>
