<script setup lang="ts">
import { useRoute } from '@/stores/route'
import { watch } from 'vue'
const { linkTo } = useRoute()

const username = defineModel('username')
const password = defineModel('password')

watch(username, () => {
  console.log(username.value)
})
</script>
<template>
  <div class="login">
    <main>
      <div>login</div>
      <input v-model="username" />
      <input v-model="password" />
      <div>
        <button>登录</button>
        <button>注册</button>
        <button>返回</button>
        <button @click="linkTo('today')">主页</button>
      </div>
    </main>
  </div>
</template>
<style scoped>
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background-color: var(--background-bottom-color);

  main {
    display: flex;
    flex-direction: column;
    width: 400px;
    height: fit-content;
    padding: 8px;
    background-color: aquamarine;
    border: 1px solid #00000020;
    border-radius: 8px;
  }
}
</style>
