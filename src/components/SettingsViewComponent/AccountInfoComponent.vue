<script setup lang="ts">
import { useAccount } from '@/stores/account'
import LoginComponent from './LoginComponent.vue'
import $bus from '@/lib/bus'
import { ApiControllerApi } from '@/openapi'

const account = useAccount()

function openLogin() {
  $bus.emit('login', { visible: true })
}

function handleLogout() {
  account.logout()
}

const api = new ApiControllerApi()
function testApi() {
  api.hello().then((r) => console.log(r))
}
</script>

<template>
  <div v-if="account.online">
    <button @click="handleLogout">注销</button>
    <button @click="testApi">test api</button>
  </div>
  <div v-else>
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
