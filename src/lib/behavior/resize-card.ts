import { BaseBehavior } from '@/lib/base'
import { currentProject } from '@/stores/service/project-service'
import { useSettings } from '@/stores/settings'

export class ResizeCard extends BaseBehavior {
  settings = useSettings()
  project = currentProject()

  onmouseover(e: MouseEvent) {
    console.log(e.target)
  }
}