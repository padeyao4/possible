import { useRoute } from 'vue-router'
import { useStore } from '@renderer/store'

export function useProject() {
  const route = useRoute()
  const store = useStore()
  return store.projects.get(route.params.id as string)
}
