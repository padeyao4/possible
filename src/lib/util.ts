import type { Point, Project } from '@/stores/project';

export function getCanvasPointByOffsetPoint(point: Point, project: Project) {
  return {
    x: point.x - project.offset.x,
    y: point.y - project.offset.y
  };
}
