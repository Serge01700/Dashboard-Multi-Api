import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/page/HomePage.vue'
import DashboardLayout from '../layouts/DashboardLayout.vue'

const routes = [
    {
        path: '/',
        name: 'HomePage',
        component: Home
    },

    {
        path: '/login',
        name : 'login',
        props: true,
        component : () => import('@/page/Login.vue')
    },

    {
        path: '/register',
        name: 'register',
        component : () => import('@/page/Register.vue')
    },
    {
        path: '/dashboard',
        component: DashboardLayout,
        props: true,
           children: [
               {
                   path: 'home',
                   name: 'DashboardHome',
                   component : () => import('@/page/HomeDashboard.vue')
               },

               {
                   path: 'settings',
                   name: 'DashboardSetting',
                   component : () => import('@/page/SettingsDashboard.vue')
               },

               {
                   path: 'todo',
                   name: 'TodoPage',
                   component : () => import('@/page/TodoPage.vue')
               },
               {
                   path: 'mail',
                   name: 'MailPage',
                   component : () => import('@/page/MailDashboard.vue')
               },
               {
                path: 'calendar,',
                name: 'calendarPage',
                component : () => import('@/page/CalendarDashboard.vue')
               },

           ]
    }

]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router