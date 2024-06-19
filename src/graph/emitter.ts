import mitt from 'mitt';

const emitter = mitt();

export default emitter;

export const BusEvents = {
  // 控制右键菜单显示
  'graph:contextmenu': Symbol()
};
