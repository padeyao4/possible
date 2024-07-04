import mitt from 'mitt';
import { Backlog, Edge, Node, Project } from '@/core';

export type ErrorMessage = { message: string };

type Events = {
  'node:update': Node;
  'node:create': Node;
  'node:delete': Node;
  'edge:update': Edge;
  'edge:create': Edge;
  'edge:delete': Edge;
  'project:create': Project;
  'project:update': Project;
  'project:delete': Project;
  'backlog:create': Backlog;
  'backlog:update': Backlog;
  'backlog:delete': Backlog;
  'backlog:open': Backlog;
  'backlog:close': Backlog;
  'graph:contextmenu': any;
  'login:success': any;
  'login:failed': ErrorMessage;
  'register:success': null;
  'register:failed': ErrorMessage;
  'date:update': null;
  [key: symbol]: any;
};

const emitter = mitt<Events>();

export default emitter;

export const BusEvents = {
  // 控制右键菜单显示
  'graph:contextmenu': Symbol(),
  'editor:open': Symbol(),
  'editor:close': Symbol(),
  // 账号登录成功后发出
  'login:success': Symbol(),
  'login:failed': Symbol(),

  'error:message': Symbol(),
  'project:push': Symbol(),
  'project:fetch': Symbol(),
  // 项目开始加载
  'project:load': Symbol(),
  'project:daily:update': Symbol(),
  'project:push:success': Symbol(),
  'project:push:failed': Symbol(),
  'project:updated': Symbol(),
  'project:deleted': Symbol(),
  'project:created': Symbol(),

  'node:created': Symbol(),
  'node:updated': Symbol(),
  'node:deleted': Symbol(),
  'edge:deleted': Symbol(),
  'edge:created': Symbol(),
  'time:updated': Symbol(),
  // 注册
  'register:success': Symbol(),
  'register:failed': Symbol(),
  // backlog
  'backlog:event': Symbol(),
  'app:reload': Symbol()
};

export const dataChangeEvents = new Set([
  BusEvents['node:created'],
  BusEvents['node:updated'],
  BusEvents['node:deleted'],
  BusEvents['edge:created'],
  BusEvents['edge:deleted'],
  BusEvents['project:updated'],
  BusEvents['project:created'],
  BusEvents['project:deleted']
]);

export enum EventTypes {
  'node:change'
}
