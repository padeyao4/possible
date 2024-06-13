<script setup lang="ts">
import $bus from '@/lib/bus'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { AccountControllerApi } from '@/openapi'

const visible = ref(false)

const username = defineModel<string>('username')
const password = defineModel<string>('password')
const api = new AccountControllerApi()

watch(username, () => {
  console.log(username.value)
})

onMounted(() => {
  $bus.on('login', (e: any) => {
    visible.value = e.visible
  })
})

onBeforeUnmount(() => {
  $bus.off('login')
})

function handleClose() {
  visible.value = false
  username.value = ''
  password.value = ''
}

async function handleLogin() {
  const respone = await api.login({
    username: username.value,
    password: password.value
  })
  const { data } = respone
  console.log(data)
}
</script>
<template>
  <div class="login" v-if="visible">
    <main>
      <div>login</div>
      <input v-model="username" />
      <input v-model="password" />
      <div>
        <button @click="handleLogin">登录</button>
        <button>注册</button>
        <button @click="handleClose">关闭</button>
      </div>
    </main>
  </div>
</template>
<style scoped>
.login {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background-color: #00000020;

  main {
    display: flex;
    flex-direction: column;
    width: 450px;
    height: fit-content;
    padding: 8px;
    background-color: aquamarine;
    border: 1px solid #00000020;
    border-radius: 8px;
  }
}
</style>
