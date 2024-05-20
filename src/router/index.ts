import { createRouter, createWebHistory } from 'vue-router'
import ListView from '@/views/ListView.vue'
import ProjectView from '@/views/ProjectView.vue'
import BacklogView from '@/views/BacklogView.vue'
import ManageView from '@/views/ManageView.vue'
import IndexView from '@/views/IndexView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/index',
      component: IndexView,
      children: [
        {
          path: 'today',
          component: ListView
        },
        {
          path: 'backlog',
          component: BacklogView
        },
        {
          path: 'manage',
          component: ManageView
        },
        {
          path: 'project/:id',
          props: true,
          component: ProjectView
        }
      ]
    }
  ]
})

export default router
