import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/page/HomePage.vue'
import DashboardLayout from '../layouts/DashboardLayout.vue'
import { useAuthStore } from '@/stores/auth'

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
        meta: { requiresAuth: true },
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
                path: 'calendar',
                name: 'calendarPage',
                component : () => import('@/page/CalendarDashboard.vue')
            },
            {
                path: 'bourse',
                name: 'BoursePage',
                component : () => import('@/page/BourseDashboard.vue')
            },
            {
                path: 'weather',
                name: 'WeatherPage',
                component : () => import('@/page/WeatherDashboard.vue')
            },
            {
                path: 'music',
                name: 'MusicPage',
                component : () => import('@/page/MusicDashboard.vue')
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

    // Si la route nécessite une authentification
    if (requiresAuth) {
        // Vérifier si l'utilisateur est connecté
        if (!authStore.isAuthenticated) {
            // Rediriger vers la page de connexion avec l'URL de retour
            next({
                path: '/login',
                query: { redirect: to.fullPath }
            })
        } else {
            // L'utilisateur est authentifié, autoriser l'accès
            next()
        }
    } else {
        // Route publique, autoriser l'accès
        next()
    }
})

export default router