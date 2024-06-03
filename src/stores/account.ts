import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAccount = defineStore('account', () => {
  const token = ref()
  const name = ref()
  const email = ref()
  return {
    token,
    name,
    email
  }
})
