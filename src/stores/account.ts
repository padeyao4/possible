import { defineStore } from 'pinia'
import { ref } from 'vue'
import { AccountControllerApi } from '@/openapi'
import axios from 'axios'

const accountApi = new AccountControllerApi()

export const useAccount = defineStore('account', () => {
  const online = ref(false)
  const token = ref()

  async function login(username: string, password: string) {
    const response = await accountApi.login({ username, password })
    const { data } = response
    const { code, payload } = data
    if (code === 200) {
      token.value = payload
      online.value = true
      axios.defaults.headers.common['Token'] = payload
    }
  }

  async function logout() {
    const response = await accountApi.logout()
    if (response.data.code === 200) {
      token.value = ''
      online.value = false
      axios.defaults.headers.common['Token'] = ''
    }
  }

  return {
    online,
    token,
    login,
    logout
  }
})
