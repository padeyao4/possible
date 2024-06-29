import { AccountControllerApi, type User, UserControllerApi } from '@/openapi';
import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';
import emitter, { BusEvents } from '@/utils/emitter';

export const useAccount = defineStore('account', () => {
  const online = ref(false);
  const sync = ref(false);
  const token = ref<string>();
  const user = reactive<User>({});
  const fetchUserLoading = ref(false);

  const enable = computed(() => {
    return online.value && sync.value;
  });
  async function fetchUser() {
    try {
      fetchUserLoading.value = true;
      const response = await new UserControllerApi().userInfo();
      const remoteUser = response.data.payload;
      Object.assign(user, remoteUser);
    } catch (e) {
      emitter.emit(BusEvents['error:message'], e);
    } finally {
      fetchUserLoading.value = false;
    }
  }

  const loginLoading = ref(false);
  async function login(username: string, password: string) {
    try {
      loginLoading.value = true;
      const response = await new AccountControllerApi().login({
        username,
        password
      });
      online.value = true;
      token.value = response.data.payload;
      emitter.emit(BusEvents['login:success']);
    } catch (e) {
      emitter.emit(BusEvents['login:failed'], e);
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
      emitter.emit(BusEvents['error:message'], e);
    } finally {
      token.value = null;
      online.value = false;
      logoutLoading.value = false;
    }
  }

  return {
    user,
    token,
    online,
    sync,
    fetchUser,
    fetchUserLoading,
    login,
    loginLoading,
    logout,
    logoutLoading,
    enable
  };
});
