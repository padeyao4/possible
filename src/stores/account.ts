import router from '@/router'
import { defineStore } from 'pinia'

export const useAccountStore = defineStore("account", {
  state: () => ({
    token: localStorage.getItem('token') as string | null,
    user: undefined
  }),
  actions: {
    setToken(token: string) {
      this.token = token
      localStorage.setItem("token", token)
    },
    fetchUser() {
    },
    setUser() {
    },
    logout() {
      this.token = null;
      localStorage.clear();
      router.push({ name: 'login' });
    }
  }
})