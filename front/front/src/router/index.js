import {
    createRouter,
    createWebHashHistory
} from 'vue-router'
import store from '@/store/index.js'

const AdminLayout = () => import('@/layouts/AdminLayout.vue')
const managerHome = () => import('../views/manager/managerHome.vue')
const login = () => import('../views/patient/login.vue')
const patientHome = () => import('../views/patient/Layout/patientHome.vue')
const PatientDetail = () => import('@/views/manager/patientDetail.vue')
const DoctorManagement = () => import('@/views/manager/DoctorManagement.vue')

const routers = [
    {
        path: '/',
        redirect: '/managerHome'
    },
    {
        path: '/login',
        name: 'login',
        component: login,
        meta: {
            title: '登录页面',
            requiresAuth: false
        }
    },
    {
        path: '/',
        component: AdminLayout,
        children: [
            {
                path: 'managerHome',
                name: 'ManagerHome',
                component: managerHome,
                meta: {
                    title: '管理首页',
                    requiresAuth: true
                }
            },
            {
                path: 'prescription',
                name: 'DoctorManagement',
                component: DoctorManagement,
                meta: {
                    requiresAuth: true,
                    title: '医生管理'
                }
            },
            {
                path: 'manager/patient/:id',
                name: 'PatientDetail',
                component: PatientDetail,
                meta: {
                    requiresAuth: true,
                    title: '患者详情'
                }
            }
        ]
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes: routers
});

// 添加全局导航守卫
router.beforeEach((to, from, next) => {
    if (to.matched.length === 0) {
        next('/managerHome'); // 如果没有匹配的路由，重定向到首页
    } else {
        next();
    }
});

export { router };

