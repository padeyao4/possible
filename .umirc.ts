import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  // 注释后 使用约定路由
  // routes: [{ path: '/', component: '@/pages/index' }],
  fastRefresh: {},
});
