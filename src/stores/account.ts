import { defineStore } from 'pinia'
import axios from 'axios'
import type { User } from '@/openapi'

export const useAccountStore = defineStore("account",{
  state: () => ({
    token: <string>localStorage.getItem('token'),
    user: <User>undefined,
  }),
  actions: {
    setToken(token: string) {
      this.token = token
      localStorage.setItem("token", token)
      axios.interceptors.request.use((config) => {
        config.headers['Authorization'] = `Bearer ${this.token}`;
        return config;
      });
      console.log("set token", token)
    },
    setUser(user:User){
      this.user = user
    },
    logout(){
      this.token = null;
      localStorage.clear();
    }
  }
})