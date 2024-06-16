<script setup lang="ts">
import { useAccount } from '@/stores/account'
import CloseIconButton from '@/components/common/CloseIconButton.vue'
import { ref } from 'vue'

const visible = ref(false)
const account = useAccount()

const username = defineModel<string>('username')
const password = defineModel<string>('password')
const loginLoading = ref(false)

function handleClose() {
  visible.value = false
  username.value = ''
  password.value = ''
}

async function handleLogin() {
  if (loginLoading.value === true) return
  loginLoading.value = true
  await account.login(username.value, password.value)
  loginLoading.value = false
}
</script>
<template>
  <div class="login-button" @click="visible = !visible">登录</div>
  <Teleport to="body">
    <div class="modal" v-if="visible">
      <main>
        <div class="head">
          <div>登录</div>
          <CloseIconButton @click="handleClose" />
        </div>
        <div class="content">
          <div>
            <label for="login-username">账号</label>
            <input id="login-username" v-model="username" placeholder="你的账号..." />
          </div>
          <div>
            <label for="login-password">密码</label>
            <input
              id="login-password"
              v-model="password"
              type="password"
              placeholder="你的密码..."
            />
          </div>
        </div>
        <div class="footer">
          <div @click="handleLogin" class="submit-button">
            {{ loginLoading ? '登录中...' : '登录' }}
          </div>
        </div>
      </main>
    </div>
  </Teleport>
</template>
<style scoped>
.modal {
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
}

main {
  display: flex;
  flex-direction: column;
  width: 450px;
  height: fit-content;
  padding: 8px;
  background-color: var(--background-top-color);
  border: 1px solid #00000030;
  border-radius: 8px;
  box-shadow:
    0 0 10px rgba(0, 0, 0, 0.5),
    0 0 20px rgba(247, 247, 249, 0.25);
}

.head {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 40px;
}
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.content > * {
  margin: 4px 0;
}

.footer {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
}
.login-button {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 4px;
  padding: 0 4px;
  color: #00000090;
  border: 1px solid #00000050;
  border-radius: 4px;
}

input {
  margin-left: 8px;
  padding: 6px;
  font-size: 13px;
  border: 1px solid #00000050;
  border-radius: 4px;
  outline: none;
}
.submit-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px 4px;
  color: #00000090;
  background-color: var(--primary-color);
  border: 1px solid #00000050;
  border-radius: 4px;
}
.submit-button:hover {
  opacity: 0.8;
}
</style>
