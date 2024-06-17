import {
  AccountControllerApi,
  Configuration,
  StorageControllerApi,
  UserControllerApi
} from '@/openapi'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useNotity } from './notity'
import { useProjects } from './projects'

export const useAccount = defineStore('account', () => {
  const online = ref(false)
  const username = ref<string>()
  const enableSync = ref(false)
  const token = ref<string>()
  const dataVersion = ref<number>()

  const projects = useProjects()
  const notity = useNotity()

  function getConfig() {
    return new Configuration({
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
    if (response.data.code === 200) {
      username.value = response.data.payload.username
    } else {
      notity.syncAccountFailed = true
    }
  }

  async function login(username: string, password: string) {
    const accountApi = new AccountControllerApi(getConfig())
    const response = await accountApi.login({ username, password })
    if (response.data.code === 200) {
      token.value = response.data.payload
      online.value = true
    }
    return response.data
  }

  async function logout() {
    const accountApi = new AccountControllerApi(getConfig())
    await accountApi.logout()
    console.log('logout..')
    online.value = false
    token.value = ''
  }

  async function sendProjects() {
    const storageApi = new StorageControllerApi(getConfig())
    const response = await storageApi.put({
      uploadAt: new Date().toJSON(),
      content: JSON.stringify(projects.serialize()),
      parentId: dataVersion.value
    })
    if (response.data.code === 200) {
      dataVersion.value = response.data.payload
    } else {
      notity.projectsSyncFailed = true
      console.warn('project data has fork')
    }
  }

  async function sendForceProjects() {
    const storageApi = new StorageControllerApi(getConfig())
    const response = await storageApi.forcePut({
      uploadAt: new Date().toJSON(),
      content: JSON.stringify(projects.serialize()),
      parentId: dataVersion.value
    })
    if (response.data.code === 200) {
      dataVersion.value = response.data.payload
      notity.projectsSyncFailed = false
    } else {
      // todo 强制同步失败
    }
  }

  async function pullProjects() {
    const storageApi = new StorageControllerApi(getConfig())
    const response = await storageApi.get()
    if (response.data.code === 200) {
      const o = JSON.parse(response.data.payload.content)
      projects.deserialize(o)
      dataVersion.value = response.data.payload.id
      notity.projectsSyncFailed = false
    } else {
      // todo 加载服务端数据异常
    }
  }

  return {
    online,
    username,
    token,
    enableSync,
    dataVersion,
    login,
    logout,
    syncAccountInfo,
    sendProjects,
    sendForceProjects,
    pullProjects
  }
})
