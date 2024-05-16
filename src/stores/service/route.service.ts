import { useSettings } from '@/stores/settings'
import router from '@/router'

export function linkTo(path: string) {
  const settings = useSettings()
  setTimeout(async () => {
    await router.push(path)
  })
  settings.active = path.split('/').pop()
}