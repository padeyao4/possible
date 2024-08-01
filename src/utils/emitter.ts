import mitt from 'mitt';
import { Backlog, Edge, type ID, Node, Project } from '@/core';

export type Error = { message: string; [key: string]: any };

type DataEvents = {
  'node:update': Partial<Node>;
  'node:create': Partial<Node>;
  'node:delete': Partial<Node>;
  'node:select': Partial<Node>;

  'edge:update': Partial<Edge>;
  'edge:create': Partial<Edge>;
  'edge:delete': Partial<Edge>;
  'edge:select': Partial<Edge>;

  'project:create': Partial<Project>;
  'project:update': Partial<Project>;
  'project:delete': ID;
  'project:select': Partial<Project>;

  'backlog:create': Partial<Backlog>;
  'backlog:update': Partial<Backlog>;
  'backlog:delete': Partial<Backlog>;
  'backlog:select': Partial<Backlog>;

  'date:update': null;
};

export type EditorParameters = {
  item: Partial<Node | Project | Backlog>;
  type: 'node' | 'project' | 'backlog';
};

type UiEvents = {
  'editor:open': EditorParameters;
  'editor:close': EditorParameters;
  'editor-node:open': Partial<Node>;
  'editor-node:close': Partial<Node>;
  'editor-project:open': Partial<Project>;
  'editor-project:close': Partial<Project>;
  'editor-backlog:open': Partial<Backlog>;
  'editor-backlog:close': Partial<Backlog>;
  'project-dialog:open': Partial<Project>;
  'project-dialog:close': Partial<Project>;
  'contextmenu-canvas:open': any;
  'login:success': any;
  'login:failed': Error;
  'register:success': null;
  'register:failed': Error;
};

type LocalEvents = {
  'local:save': any;
  'local:load': any;
  'local:login': any;
  'local:logout': any;
};

type NotifyEvents = {
  'notify:success': string;
  'notify:failed': string;
  'notify:warning': string;
  'notify:info': string;
  'notify:error': Error;
};

export const emitter = mitt<DataEvents & UiEvents & NotifyEvents & LocalEvents>();
