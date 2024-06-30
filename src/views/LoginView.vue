<script setup lang="ts">
import { reactive } from 'vue';
import { useAccount } from '@/stores/account';
import router from '@/router';
import type { FormRules } from 'element-plus';

const account = useAccount();

const form = reactive({
  username: '',
  password: '',
  checkPassword: ''
});

const onSubmit = async () => {
  await account.login(form.username, form.password);
  await router.push({ name: 'today' });
};

const onRegister = async () => {
  await account.register(form.username, form.password);
};

const rules = reactive<FormRules<typeof form>>({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  checkPassword: [
    {
      required: true,
      message: '请确认密码',
      trigger: 'blur',
      validator: () => {
        return form.checkPassword === form.password;
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
            <el-tab-pane label="Login">
              <el-form :model="form" class="login-form" :rules="rules">
                <el-form-item prop="username">
                  <el-input v-model="form.username" placeholder="username" />
                </el-form-item>
                <el-form-item prop="password">
                  <el-input v-model="form.password" placeholder="password" type="password" />
                </el-form-item>
              </el-form>
              <div class="operations">
                <el-link type="info">忘记密码?</el-link>
                <el-button type="primary" @click="onSubmit" :loading="account.loginLoading"
                  >Login</el-button
                >
              </div>
            </el-tab-pane>
            <el-tab-pane label="Register">
              <el-form :model="form" class="login-form" :rules="rules">
                <el-form-item prop="username">
                  <el-input v-model="form.username" placeholder="username" />
                </el-form-item>
                <el-form-item prop="password">
                  <el-input v-model="form.password" placeholder="password" type="password" />
                </el-form-item>
                <el-form-item prop="checkPassword">
                  <el-input
                    v-model="form.checkPassword"
                    autocomplete="off"
                    placeholder="confirm password"
                    type="password"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onRegister" :loading="false"
                    >register</el-button
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
      justify-content: space-between;
      margin-top: 15px;
    }
  }
}
</style>
