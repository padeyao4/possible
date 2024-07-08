import { AccountControllerApi, type User, UserControllerApi } from '@/openapi';
import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';
import { emitter } from '@/utils';

export const useAccount = defineStore('account', () => {
  const isAuth = ref(false);
  const isLocal = ref(false);
  const token = ref<string>();
  const user = reactive<User>({});
  const fetchUserLoading = ref(false);

  const isRemote = computed(() => {
    return !isLocal.value;
  });

  async function fetchUser() {
    try {
      fetchUserLoading.value = true;
      const response = await new UserControllerApi().userInfo();
      const remoteUser = response.data.payload;
      Object.assign(user, remoteUser);
    } catch (e) {
      emitter.emit('notify:error', e);
    } finally {
      fetchUserLoading.value = false;
    }
  }

  function $reset() {
    isAuth.value = false;
    isLocal.value = false;
    token.value = undefined;
    fetchUserLoading.value = false;
  }

  const loginLoading = ref(false);
  async function login(username: string, password: string) {
    try {
      loginLoading.value = true;
      const response = await new AccountControllerApi().login({
        username,
        password
      });
      token.value = response.data.payload;
      isAuth.value = true;
      emitter.emit('login:success');
    } catch (e) {
      isAuth.value = false;
      emitter.emit('login:failed', e);
    } finally {
      loginLoading.value = false;
    }
  }

  const logoutLoading = ref(false);
  async function logout() {
    try {
      logoutLoading.value = true;
      await new AccountControllerApi().logout();
    } catch (e) {
      emitter.emit('notify:error', e);
    } finally {
      token.value = null;
      logoutLoading.value = false;
      isAuth.value = false;
    }
  }

  const registerLoading = ref(false);
  async function register(username: string, password: string) {
    try {
      registerLoading.value = true;
      await new AccountControllerApi().register({
        username,
        password
      });
      emitter.emit('register:success');
    } catch (e) {
      emitter.emit('register:failed', e);
    } finally {
      registerLoading.value = false;
    }
  }

  const checkUsernameLoading = ref(false);
  async function checkUsername(username: string) {
    try {
      checkUsernameLoading.value = true;
      return await new AccountControllerApi().checkUsername(username);
    } catch (e) {
      emitter.emit('notify:error', e);
    } finally {
      checkUsernameLoading.value = false;
    }
  }

  return {
    user,
    token,
    fetchUser,
    fetchUserLoading,
    login,
    loginLoading,
    logout,
    logoutLoading,
    isLocal,
    isRemote,
    isAuth,
    register,
    registerLoading,
    checkUsername,
    checkUsernameLoading,
    $reset
  };
});
