import { createRouter, createWebHistory } from 'vue-router'
import TodayView from '../views/TodayView.vue'
import ProjectView from '../views/ProjectView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'today',
      component: TodayView
    },
    {
      path: '/project/:id',
      name: 'project',
      component: ProjectView,
      props: true
    }
  ]
})

export default router
