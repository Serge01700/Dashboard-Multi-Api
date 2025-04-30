import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/page/HomePage.vue'
import DashboardLayout from '@/layout/DashboardLayout.vue'

const routes = [
    {
        path: '/',
        name: 'HomePage',
        component: Home
    },

    {
        path: '/dashboard',
        component: DashboardLayout,
           children: [
               {
                   path: '/DashboardHome',
                   name: 'Dashboard',
                   component : () => import('@/page/HomeDashboard.vue')
               },

               {
                   path: 'Settings',
                   name: 'DashboardSetting',
                   component : () => import('@/page/DashboardSettings.vue')
                   
               }
           ]
    }


  

]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router