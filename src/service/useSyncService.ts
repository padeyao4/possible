import { useAccount } from '@/stores/account'
import { useProjects } from '@/stores/projects'
import { useDebounceFn } from '@vueuse/core'
import { computed, ref, watch } from 'vue'

export default function () {
  const account = useAccount()
  const projects = useProjects()

  const isSync = computed(() => {
    return account.online && account.enableSync
  })

  const unsubscribe = ref()

  const syncFnc = useDebounceFn(() => {
    try {
      account.syncProjects()
    } catch (e) {
      console.error('project sync failed', e)
    }
  }, 3_000)

  watch(
    isSync,
    (newValue) => {
      if (newValue) {
        unsubscribe.value?.()
        unsubscribe.value = projects.$subscribe(syncFnc)
      }
    },
    { immediate: true }
  )
}
