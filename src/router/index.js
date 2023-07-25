import { createRouter, createWebHistory } from 'vue-router'
import TodayView from '../views/TodayView.vue'
import SummeryView from '../views/SummeryView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: TodayView
    },
    {
      path: '/about',
      name: 'about',
      component: SummeryView
    }
  ]
})

export default router
