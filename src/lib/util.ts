import type { Point, Project } from '@/stores/projects'
import { useSettings } from '@/stores/settings'

export function getCanvasPointByOffsetPoint(point: Point, project: Project) {
  const settings = useSettings()
  return {
    x: point.x - settings.offsetX - project.offset.x,
    y: point.y - settings.offsetY - project.offset.y
  }
}