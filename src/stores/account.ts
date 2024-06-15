import { defineStore } from 'pinia'
import { ref } from 'vue'
import { AccountControllerApi, Configuration, UserControllerApi } from '@/openapi'

export const useAccount = defineStore('account', () => {
  const online = ref(false)
  const username = ref<string>()
  const enableSync = ref(false)

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
    const userApi = new UserControllerApi(getConfig())
    const response = await userApi.userInfo()
    username.value = response.data.payload.username
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
    enableSync,
    login,
    logout,
    syncAccountInfo
  }
})
