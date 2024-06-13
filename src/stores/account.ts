import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Account } from './types'

export const useAccount = defineStore('account', () => {
  const online = ref(false)
  const detail = ref<Account>()
  return {
    online,
    detail
  }
})
