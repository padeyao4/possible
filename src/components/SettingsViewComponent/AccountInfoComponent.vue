<script setup lang="ts">
import { useAccount } from '@/stores/account'
import LoginComponent from './LoginComponent.vue'
import $bus from '@/lib/bus'
import { ApiControllerApi } from '@/openapi'
import { ref } from 'vue'

const account = useAccount()
const api = new ApiControllerApi()

function openLogin() {
  $bus.emit('login', { visible: true })
}

function handleLogout() {
  account.logout()
}

const testText = ref()

function testApi() {
  api.hello().then((r) => {
    testText.value = r.data.message
  })
}
</script>

<template>
  <div>
    <div v-if="account.online">
      <button @click="handleLogout">注销</button>
    </div>
    <div v-else>
      <button @click="openLogin">登录</button>
      <button @click="() => {}">注册</button>
      <teleport to="body">
        <LoginComponent />
      </teleport>
    </div>
    <button @click="testApi">test api</button>
    <div>{{ testText }}</div>
  </div>
</template>

<style scoped></style>
