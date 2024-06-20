import mitt from 'mitt';

const emitter = mitt();

export default emitter;

export const BusEvents = {
  // 控制右键菜单显示
  'graph:contextmenu': Symbol(),
  'editor:open': Symbol(),
  'editor:close': Symbol(),
  // 账号登录成功后发出
  'account:login': Symbol()
};
