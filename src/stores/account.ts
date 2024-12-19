import router from '@/router'
import { defineStore } from 'pinia'

export const useAccountStore = defineStore("account", {
  state: () => ({
    token: localStorage.getItem('token') as string | null,
  }),
  getters: {
    username: (state) => {
      if (state.token) {
        const payload = JSON.parse(atob(state.token.split('.')[1]));
        return payload.username || null;
      }
      return null;
    }
  },
  actions: {
    setToken(token: string) {
      this.token = token
      localStorage.setItem("token", token)
    },
    logout() {
      this.token = null;
      localStorage.clear();
      router.push({ name: 'login' });
    }
  }
})