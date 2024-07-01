<script setup lang="ts">
import { useAccount } from '@/stores/account';
import CloseIconButton from '@/components/common/CloseIconButton.vue';
import { onMounted, ref, watch } from 'vue';
import emitter, { BusEvents } from '@/utils/emitter';

const visible = ref(false);

const username = defineModel<string>('username');
const password = defineModel<string>('password');
const account = useAccount();

function handleClose() {
  visible.value = false;
  username.value = '';
  password.value = '';
}

async function handleLogin() {
  await account.login(username.value, password.value);
}

const loginMessage = ref();

onMounted(() => {
  emitter.on(BusEvents['login:failed'], (error: any) => {
    loginMessage.value = error.message;
  });
});

watch(
  visible,
  () => {
    if (visible.value) {
      loginMessage.value = '';
    }
  },
  { immediate: true }
);

const forgetUrl = import.meta.env.VITE_FORGET_URL ?? '/forget';
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
          <div class="account-login-info">{{ loginMessage }}</div>
        </div>
        <div class="footer">
          <a class="forget" :href="forgetUrl" target="_blank">忘记密码?</a>
          <button @click="handleLogin" class="submit-button" :data-disabled="account.loginLoading">
            {{ account.loginLoading ? '登录中...' : '登录' }}
          </button>
        </div>
      </main>
    </div>
  </Teleport>
</template>
<style scoped>
.account-login-info {
  color: #ff000090;
  font-size: 13px;
}

.forget {
  color: #00000090;
  font-size: 14px;
  text-decoration: underline;
  cursor: pointer;
}

.modal {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
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
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 4px;
  margin-bottom: 8px;
  & > * {
    margin: 0 10px;
  }
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
  color: #ffffff;
  background-color: var(--primary-color);
  border: 1px solid #00000050;
  border-radius: 4px;
  cursor: pointer;
}
.submit-button[data-disabled='false']:hover {
  opacity: 0.8;
}
</style>
