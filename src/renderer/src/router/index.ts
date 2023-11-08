import {createRouter, createWebHistory} from 'vue-router'
import TodayView from '@renderer/views/TodayView/index.vue'
import ProjectView from '@renderer/views/ProjectView/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/today',
      name: 'today',
      component: TodayView
    },
    {
      path: '/project/:id',
      name: 'project',
      component: ProjectView,
      props: true
    },
    {
      path: '/',
      redirect: '/today'
    }
  ]
})

export default router
