import { useAccount } from '@/stores/account'
import { useDebounceFn } from '@vueuse/core'
import { watch } from 'vue'

export default function () {
  const account = useAccount()

  account.$patch({
    username: localStorage.getItem('username'),
    online: Boolean(localStorage.getItem('online')),
    token: localStorage.getItem('token'),
    enableSync: Boolean(localStorage.getItem('enableSync'))
  })

  const syncFnc = useDebounceFn(() => {
    localStorage.setItem('username', account.username)
    localStorage.setItem('online', String(account.online))
    localStorage.setItem('token', account.token)
    localStorage.setItem('enableSync', String(account.enableSync))
    console.log('sync account')
  }, 500)

  account.$subscribe(syncFnc)

  watch(
    () => account.online,
    (newValue) => {
      if (newValue) {
        try {
          console.log('sync account info')
          account.syncAccountInfo()
        } catch (e) {
          console.error(e)
        }
      }
    }
  )
}
