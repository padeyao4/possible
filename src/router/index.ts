import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import TodayView from '@/views/TodayView.vue';
import ProjectView from '@/views/ProjectView.vue';
import BacklogView from '@/views/BacklogView.vue';
import ManageView from '@/views/ManageView.vue';
import IndexView from '@/views/IndexView.vue';
import SettingsView from '@/views/SettingsView.vue';

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
          path: 'manage',
          name: 'manage',
          component: ManageView
        },
        {
          path: 'project',
          name: 'project',
          props: (route) => ({ id: route.query.id }),
          component: ProjectView
        }
      ]
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView
    },
    { path: '/', redirect: '/index/today' }
  ]
});

export default router;
