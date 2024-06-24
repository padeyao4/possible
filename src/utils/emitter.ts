import mitt from 'mitt';

const emitter = mitt();

export default emitter;

export const BusEvents = {
  // 控制右键菜单显示
  'graph:contextmenu': Symbol(),
  'editor:open': Symbol(),
  'editor:close': Symbol(),
  // 账号登录成功后发出
  'account:login:success': Symbol(),
  'error:message': Symbol(),
  'project:push': Symbol(),
  'project:fetch': Symbol(),
  // 项目开始加载
  'project:load': Symbol(),
  'project:daily:update': Symbol(),
  'project:push:success': Symbol(),
  'project:push:failed': Symbol(),
  // 登录失败
  'account:login:failed': Symbol(),
  'edge:created': Symbol(),
  'node:dragend': Symbol(),
  'node:resized': Symbol(),
  'node:created': Symbol(),
  'node:updated': Symbol(),
  'node:deleted': Symbol(),
  'edge:deleted': Symbol()
};

export const dataChangeEvents = new Set([
  BusEvents['node:created'],
  BusEvents['node:updated'],
  BusEvents['node:deleted'],
  BusEvents['node:dragend'],
  BusEvents['node:resized'],
  BusEvents['edge:created'],
  BusEvents['edge:deleted']
]);
