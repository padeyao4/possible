import { defineStore } from 'pinia'
import { ref } from 'vue'
import { AccountControllerApi } from '@/openapi'
import axios from 'axios'

const accountApi = new AccountControllerApi()

export const useAccount = defineStore('account', () => {
  const online = ref(false)
  const token = ref()

  function login(
    username: string,
    password: string,
    success?: () => void,
    fail?: () => void,
    final?: () => void
  ) {
    accountApi
      .login({ username, password })
      .then((r) => {
        const { code, payload } = r.data
        if (code === 2000) {
          token.value = payload
          online.value = true
          axios.defaults.headers.common['Token'] = payload
          success?.()
        } else {
          fail?.()
        }
      })
      .catch(() => {
        fail?.()
      })
      .finally(() => final?.())
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
