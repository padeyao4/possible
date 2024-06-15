import { defineStore } from 'pinia'
import { ref } from 'vue'
import { AccountControllerApi, Configuration } from '@/openapi'

export const useAccount = defineStore('account', () => {
  const online = ref(false)
  const username = ref<string>()

  function getConfig() {
    return new Configuration({
      basePath: import.meta.env.VITE_BASE_PATH ?? '/',
      baseOptions: {
        headers: {
          Token: localStorage.getItem('token')
        }
      }
    })
  }

  async function syncAccountInfo() {
    // todo
  }

  async function login(username: string, password: string) {
    const accountApi = new AccountControllerApi(getConfig())
    const response = await accountApi.login({ username, password })
    const { payload } = response.data
    localStorage.setItem('token', payload)
    online.value = true
  }

  async function logout() {
    const accountApi = new AccountControllerApi(getConfig())
    const response = await accountApi.logout()
    if (response.data.code === 200) {
      online.value = false
      localStorage.setItem('token', '')
    }
  }

  return {
    online,
    username,
    login,
    logout,
    syncAccountInfo
  }
})
