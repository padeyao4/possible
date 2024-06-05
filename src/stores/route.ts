import router from '@/router'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export type RouteEntry = {
  name: string
  param: string
}

export const useRoute = defineStore('history-route', () => {
  const entries = ref<RouteEntry[]>([])

  const active = computed(() => {
    return entries.value.length === 0
      ? { name: 'today', param: '' }
      : entries.value[entries.value.length - 1]
  })

  async function linkTo(name: string, param?: string) {
    entries.value.push({ name, param })
    const params = param ? { param } : {}
    await router.push({ name, params })
  }

  function back() {
    if (entries.value.length > 0) {
      entries.value.pop()
    }
    linkTo(active.value.name, active.value.param)
  }

  return {
    active,
    linkTo,
    back
  }
})
