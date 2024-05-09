import { useSettings } from '@/stores/settings'
import router from '@/router'

export function linkTo(path: string) {
  const settings = useSettings()
  settings.active = path
  router.push(path)
}