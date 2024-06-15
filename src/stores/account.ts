import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  AccountControllerApi,
  Configuration,
  StorageControllerApi,
  UserControllerApi
} from '@/openapi'
import { useProjects } from './projects'

export const useAccount = defineStore('account', () => {
  const online = ref(false)
  const username = ref<string>()
  const enableSync = ref(false)
  const token = ref<string>()

  const projects = useProjects()

  function getConfig() {
    return new Configuration({
      basePath: import.meta.env.VITE_BASE_PATH ?? '/',
      baseOptions: {
        headers: {
          Token: token.value
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
    token.value = response.data.payload
    online.value = true
  }

  async function logout() {
    const accountApi = new AccountControllerApi(getConfig())
    const response = await accountApi.logout()
    if (response.data.code === 200) {
      online.value = false
      token.value = ''
    }
  }

  async function syncProjects() {
    const storageApi = new StorageControllerApi(getConfig())
    storageApi.put({
      uploadAt: new Date().toJSON(),
      content: JSON.stringify(projects.serialize())
    })
  }

  return {
    online,
    username,
    token,
    enableSync,
    login,
    logout,
    syncAccountInfo,
    syncProjects
  }
})
