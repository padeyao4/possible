import type { Plan } from '@/stores';
import mitt from 'mitt';

/**
 * @description
 * Custom events,界面控制事件
 */
type CustomEvents = {
  'open-create-project-dialog': null;
  'open-delete-project-dialog': Plan;
  'open-canvas-menu': {
    menuType: 'canvas' | 'node' | 'edge';
    x: number;
    y: number;
    itemId?: string;
  };
  'open-canvas-card-editor': {
    nodeId: string;
  };
  'edite-project-name': Plan;
  'open-canvas-card-editor-by-menu': {
    x: number;
    y: number;
    nodeId: string;
  };
  'open-editor': {
    id: string;
  };
};

export const emitter = mitt<CustomEvents>();
