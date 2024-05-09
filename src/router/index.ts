import { createRouter, createWebHistory } from 'vue-router'
import ListView from '@/views/ListView.vue'
import ProjectView from '@/views/ProjectView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/today',
      name: 'home',
      component: ListView
    },
    {
      name: 'project',
      path: '/project/:id',
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
