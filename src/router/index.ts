import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProjectView from '@/views/ProjectView.vue'
import CompletedView from '@/views/CompletedView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/today',
      name: 'home',
      component: HomeView
    },
    {
      path: '/completed',
      name: 'completed',
      component: CompletedView
    },
    {
      path: '/project/:id',
      name: 'project',
      props: true,
      component: ProjectView
    },
    {
      path: '/',
      redirect: '/today'
    }
  ]
})

export default router
