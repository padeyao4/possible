import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useNotity = defineStore('notity', () => {
  const userLoginFailed = ref()
  const syncAccountFailed = ref()
  const projectsSyncFailed = ref()

  const hasNotity = computed(() => {
    return syncAccountFailed.value || syncAccountFailed.value || projectsSyncFailed.value
  })

  return {
    userLoginFailed,
    syncAccountFailed,
    projectsSyncFailed,
    hasNotity
  }
})
