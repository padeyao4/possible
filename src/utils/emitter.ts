import mitt from 'mitt';
// import { Backlog, Edge, Node } from '@/core';
import type { ID, Project } from '@/stores';

// export type Error = { message: string; [key: string]: any };

// export type EditorParameters = {
//   item: Partial<Node | Project | Backlog>;
//   type: 'node' | 'project' | 'backlog';
// };

// type UiEvents = {
//   'editor:open': EditorParameters;
//   'editor:close': EditorParameters;
//   'editor:delete': any;
//   'editor-node:open': Partial<Node>;
//   'editor-node:close': Partial<Node>;
//   'editor-project:open': Partial<Project>;
//   'editor-project:close': Partial<Project>;
//   'editor-backlog:open': Partial<Backlog>;
//   'editor-backlog:close': Partial<Backlog>;
//   'project-dialog:open': Project;
//   'project-dialog:close': Partial<Project>;
//   'contextmenu-canvas:open': any;
//   'login:success': any;
//   'login:failed': Error;
//   'register:success': null;
//   'register:failed': Error;
// };
//
// type LocalEvents = {
//   'local:save': any;
//   'local:load': any;
//   'local:login': any;
//   'local:logout': any;
// };

// type NotifyEvents = {
//   'notify:success': string;
//   'notify:failed': string;
//   'notify:warning': string;
//   'notify:info': string;
//   'notify:error': Error;
// };

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
};

export const emitter = mitt<CustomEvents>();
