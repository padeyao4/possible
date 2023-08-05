import { createRouter, createWebHistory } from 'vue-router'
import TodayView from '../views/TodayView.vue'
import SummeryView from '../views/SummeryView.vue'
import TestView from '../views/TestView.vue'


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
      component: SummeryView
    },
    {
      path: '/test',
      component: TestView
    }
  ]
})

export default router
