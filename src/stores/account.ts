import { AccountControllerApi, type User } from '@/openapi'
import router from '@/router'
import { defineStore } from 'pinia'

export const useAccountStore = defineStore("account", {
  state: () => ({
    token: localStorage.getItem('token') as string | null,
    user: undefined as User | undefined,
  }),
  actions: {
    setToken(token: string) {
      this.token = token
      localStorage.setItem("token", token)
    },
    fetchUser() {
      new AccountControllerApi().getUser().then((res) => {
        this.user = res.data.payload;
      });
    },
    setUser(user: User) {
      this.user = user
    },
    logout() {
      this.token = null;
      localStorage.clear();
      router.push({ name: 'login' });
    }
  }
})