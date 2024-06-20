import { AccountControllerApi, type User, UserControllerApi } from '@/openapi';
import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import { config } from '@/service/client';
import emitter, { BusEvents } from '@/utils/emitter';

export const useAccount = defineStore(
  'account',
  () => {
    const online = ref(false);
    const enableSync = ref(false);
    const token = ref<string>();
    const user = reactive<User>({});
    const fetchUserLoading = ref(false);

    async function fetchUser() {
      try {
        fetchUserLoading.value = true;
        const response = await new UserControllerApi(config()).userInfo();
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
        const response = await new AccountControllerApi(config()).login({
          username,
          password
        });
        online.value = true;
        token.value = response.data.payload;
        emitter.emit(BusEvents['account:login:success']);
      } catch (e) {
        emitter.emit(BusEvents['account:login:failed'], e);
      } finally {
        loginLoading.value = false;
      }
    }

    const logoutLoading = ref(false);
    async function logout() {
      try {
        logoutLoading.value = true;
        await new AccountControllerApi(config()).logout();
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
      enableSync,
      fetchUser,
      fetchUserLoading,
      login,
      loginLoading,
      logout,
      logoutLoading
    };
  },
  {
    persist: true
  }
);
