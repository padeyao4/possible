import { createRouter, createWebHashHistory } from 'vue-router';
import TodayView from '@/views/TodayView.vue';
import ProjectView from '@/views/ProjectView.vue';
import BacklogView from '@/views/BacklogView.vue';
import SettingsView from '@/views/SettingsView.vue';
import IndexView from '@/views/IndexView.vue';
import LoginView from '@/views/LoginView.vue';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/index',
      component: IndexView,
      children: [
        {
          path: 'today',
          name: 'today',
          component: TodayView
        },
        {
          path: 'backlog',
          name: 'backlog',
          component: BacklogView
        },
        {
          path: 'project',
          name: 'project',
          props: (route) => ({ id: route.query.id }),
          component: ProjectView
        },
        {
          path: '/test',
          name: 'test',
          component: () => import('@/views/TestView.vue')
        },
      ]
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    { path: '/', redirect: '/index/today' }
  ]
});

export default router;
