import mitt from 'mitt';
import { Backlog, Edge, type ID, Node, Project } from '@/core';

export type Error = { message: string; [key: string]: any };

type DataEvents = {
  'node:update': Node;
  'node:create': Node;
  'node:delete': Node;
  'node:select': Node;

  'edge:update': Edge;
  'edge:create': Edge;
  'edge:delete': Edge;
  'edge:select': Edge;

  'project:create': Project;
  'project:update': Project;
  'project:delete': ID;
  'project:select': Project;

  'backlog:create': Backlog;
  'backlog:update': Backlog;
  'backlog:delete': Backlog;
  'backlog:select': Backlog;

  'date:update': null;
};

type UiEvents = {
  'editor-node:open': Node;
  'editor-node:close': Node;
  'editor-project:open': Project;
  'editor-project:close': Project;
  'editor-backlog:open': Backlog;
  'editor-backlog:close': Backlog;
  'project-dialog:open': Project;
  'project-dialog:close': Project;
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
