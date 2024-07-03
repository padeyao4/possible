<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useAccount } from '@/stores/account';
import router from '@/router';
import type { FormInstance, FormRules } from 'element-plus';
import emitter, { BusEvents } from '@/utils/emitter';
import { Close } from '@element-plus/icons-vue';

const account = useAccount();

const loginFormEl = ref<FormInstance>();
const registerFormEl = ref<FormInstance>();

const isRegister = ref(false);

const loginForm = reactive({
  username: '',
  password: '',
  loginError: ''
});

const registerForm = reactive({
  username: '',
  password: '',
  checkPassword: '',
  registerError: ''
});

function handleResetRegister() {
  isRegister.value = false;
  Object.assign(registerForm, {
    username: '',
    password: '',
    checkPassword: '',
    registerError: ''
  });
}

emitter.on(BusEvents['login:failed'], (e: any) => {
  loginForm.loginError = e.message;
});

emitter.on(BusEvents['register:success'], () => {
  isRegister.value = true;
});

emitter.on(BusEvents['register:failed'], (e: any) => {
  registerForm.registerError = e.message;
});

const submitLogin = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      await account.login(loginForm.username, loginForm.password);
      await router.push({ name: 'today' });
    } else {
      console.log('error submit!', fields);
    }
  });
};

const submitRegister = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      await account.register(registerForm.username, registerForm.password);
    } else {
      console.log('error submit!', fields);
    }
  });
};

const loginRules = reactive<FormRules<typeof loginForm>>({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
});

const registerRules = reactive<FormRules<typeof registerForm>>({
  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'blur'
    }
  ],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  checkPassword: [
    {
      required: true,
      trigger: 'blur',
      validator: (rule, value, callback, source, options) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== registerForm.password) {
          callback(new Error('两次密码不相同!'));
        } else {
          callback();
        }
      }
    }
  ]
});
</script>

<template>
  <div class="login">
    <div class="left"></div>
    <div class="right">
      <div class="container">
        <div>
          <el-tabs>
            <el-tab-pane label="登录">
              <el-form ref="loginFormEl" :model="loginForm" class="login-form" :rules="loginRules">
                <el-form-item prop="username">
                  <el-input v-model="loginForm.username" placeholder="请输入账号" />
                </el-form-item>
                <el-form-item prop="password">
                  <el-input v-model="loginForm.password" placeholder="请输入密码" type="password" />
                </el-form-item>
                <el-form-item :error="loginForm.loginError">
                  <template #default>
                    <div class="operations">
                      <div>
                        <el-text tag="ins" class="forget-text">忘记密码?</el-text>
                      </div>
                      <el-button
                        type="primary"
                        @click="submitLogin(loginFormEl)"
                        :loading="account.loginLoading"
                        size="small"
                        >登录</el-button
                      >
                    </div>
                  </template>
                </el-form-item>
              </el-form>
              <el-divider><el-text size="small">其他登录方式</el-text></el-divider>
              <el-button size="small" round><el-text size="small">本地</el-text></el-button>
            </el-tab-pane>
            <el-tab-pane label="注册">
              <el-card v-if="isRegister">
                <template #default>
                  <div style="display: flex; justify-content: space-between">
                    <el-text type="success">
                      <b
                        ><i>{{ registerForm.username }}</i></b
                      >
                      register success</el-text
                    >
                    <el-button :icon="Close" size="small" @click="handleResetRegister" />
                  </div>
                </template>
              </el-card>
              <el-form
                ref="registerFormEl"
                v-else
                :model="registerForm"
                class="login-form"
                :rules="registerRules"
              >
                <el-form-item prop="username">
                  <el-input v-model="registerForm.username" placeholder="请输入用户名" />
                </el-form-item>
                <el-form-item prop="password">
                  <el-input
                    v-model="registerForm.password"
                    placeholder="请输入密码"
                    type="password"
                  />
                </el-form-item>
                <el-form-item prop="checkPassword">
                  <el-input
                    v-model="registerForm.checkPassword"
                    autocomplete="off"
                    placeholder="确认密码"
                    type="password"
                  />
                </el-form-item>
                <el-form-item :error="registerForm.registerError">
                  <el-button
                    type="primary"
                    @click="submitRegister(registerFormEl)"
                    :loading="account.registerLoading"
                    size="small"
                    >注册</el-button
                  >
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login {
  display: flex;
  flex-direction: row;
  width: 100vw;
  height: 100vh;
  background-color: #3a8ee6;
}
.left {
  width: 50%;
  height: 100%;
  background-color: rgb(23, 153, 255);
}
.right {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
  height: 100%;
  background-color: #ffffff;
  .container {
    width: 250px;
    .login-form {
      display: grid;
      grid-template-rows: 1fr 1fr;
    }
    .operations {
      display: flex;
      align-items: end !important;
      justify-content: space-between;
      width: 100%;
    }
  }
}
</style>