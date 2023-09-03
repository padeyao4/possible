import {createRouter, createWebHistory} from 'vue-router'
import TodayView from '../views/TodayView.vue'
import ProjectView from "@renderer/views/ProjectView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: TodayView
    },
    {
      path: '/summery',
      name: 'summery',
      component: ProjectView,
    },
  ]
})

export default router
