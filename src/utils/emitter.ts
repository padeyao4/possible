import mitt from 'mitt';
import type { Backlog, ID, Project } from '@/stores';

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
  };
  'open-canvas-card-editor': {
    x: number;
    y: number;
    nodeId: ID;
  };
  'edite-project-name': Project;
  'open-backlog-editor': Backlog;
};

export const emitter = mitt<CustomEvents>();
