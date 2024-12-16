import mitt from 'mitt';
import type { Project } from '@/openapi';
import type { Backlog } from '@/openapi';

/**
 * @description
 * Custom events,界面控制事件
 */
type CustomEvents = {
  'open-create-project-dialog': null;
  'open-delete-project-dialog': Project;
  'open-canvas-menu': {
    menuType: 'canvas' | 'node' | 'edge';
    x: number;
    y: number;
    itemId?: string;
  };
  'open-canvas-card-editor': {
    nodeId: string;
  };
  'open-canvas-card-editor-by-menu': {
    x: number;
    y: number;
    nodeId: string;
  };
  'edite-project-name': Project;
  'open-backlog-editor': Backlog;
};

export const emitter = mitt<CustomEvents>();
