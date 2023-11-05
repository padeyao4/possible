import {createRouter, createWebHistory} from 'vue-router'
import TodayView from '@renderer/views/TodayView.vue'
import ProjectView from '@renderer/views/ProjectView.vue'
import SettingsVue from "@renderer/views/SettingsVue.vue";
import LayoutView from "@renderer/views/LayoutView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/possible',
            name: 'layout',
            component: LayoutView,
            children: [
                {
                    path: 'today',
                    name: 'today',
                    component: TodayView
                },
                {
                    path: 'project/:id',
                    name: 'project',
                    component: ProjectView,
                    props: true
                }
            ]
        },
        {
            path: '/settings',
            name: 'settings',
            component: SettingsVue
        },
        {
            path: '/',
            name: 'index',
            redirect: '/possible/today'
        }
    ]
})

export default router
