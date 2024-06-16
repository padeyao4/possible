import { useAccount } from '@/stores/account'
import { useDebounceFn } from '@vueuse/core'
import { watch } from 'vue'

/**
 * 当客户端启动时，先加载本地数据。如果用户已登录，刷新用户信息
 */
export default function () {
  const account = useAccount()

  account.$patch({
    username: localStorage.getItem('username'),
    online: localStorage.getItem('online') === 'true',
    token: localStorage.getItem('token'),
    enableSync: localStorage.getItem('enableSync') === 'true',
    dataVersion: Number(localStorage.getItem('dataVersion'))
  })

  const syncFnc = useDebounceFn(() => {
    localStorage.setItem('username', account.username)
    localStorage.setItem('online', String(account.online))
    localStorage.setItem('token', account.token)
    localStorage.setItem('enableSync', String(account.enableSync))
    localStorage.setItem('dataVersion', String(account.dataVersion))
  }, 500)

  account.$subscribe(syncFnc)

  watch(
    () => account.online,
    (newValue) => {
      if (newValue) {
        account.syncAccountInfo()
      }
    },
    {
      immediate: true
    }
  )
}
