import { AccountControllerApi, type User, UserControllerApi } from '@/openapi';
import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';
import { emitter } from '@/utils';

export const useAccount = defineStore('account', () => {
  const isAuth = ref(false);
  const isLocal = ref(false);
  const token = ref<string>();
  const user = reactive<User>({});

  const isRemote = computed(() => {
    return !isLocal.value;
  });

  const fetchUserLoading = ref(false);
  async function fetchUser() {
    if (isRemote) {
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
    } else {
      Object.assign(user, {
        username: 'local'
      });
    }
  }

  function $reset() {
    isAuth.value = false;
    isLocal.value = false;
    token.value = undefined;
    fetchUserLoading.value = false;
  }

  const loginLoading = ref(false);
  async function login(username: string, password: string, local: boolean = false) {
    if (local) {
      isAuth.value = true;
      isLocal.value = true;
      token.value = '';
      window.ipcRenderer.send('set', {
        key: 'account',
        value: {
          isAuth: true,
          isLocal: true,
          token: ''
        }
      });
    } else {
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
  }

  const logoutLoading = ref(false);
  async function logout() {
    if (isRemote.value) {
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
    } else {
      token.value = null;
      isAuth.value = false;
      window.ipcRenderer.send('set', {
        key: 'account',
        value: {
          isAuth: false,
          isLocal: true,
          token: ''
        }
      });
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
