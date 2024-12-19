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

import managerHome from '../views/manager/managerHome.vue'
import login from '../views/patient/login.vue'

import patientHome from '../views/patient/Layout/patientHome.vue'

import PatientDetail from '@/views/manager/patientDetail.vue'


import doctor from '../views/doctor/doctor.vue'



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


        path:"/patientHome",
        name:"patientHome",
        component: patientHome,
        meta:{
            title:"患者页面",
            requiresAuth: true
        }
    },
    {

        path: '/manager/patient/:id',
        name: 'PatientDetail',
        component: PatientDetail,
        meta: {
            requiresAuth: true,
            title: '患者详情'
        }
    }

        path:"/doctor",
        name:"doctor",
        component:doctor,
        meta:{
            title: "医生页面", 
            requiresAuth: true // 表示该路由需要用户认证
        }
    }


]


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

// 路由守卫
/*
router.beforeEach((to, from, next) => {
    const isAuthenticated = store.state.user || store.state.merchant ||store.state.rider;
    const requiresAuth = to.meta.requiresAuth; // 确保获取到目标路由的 requiresAuth 属性
    if (requiresAuth && !isAuthenticated) {
        next({ path: '/login' }); // 重定向到登录
    } else {
        next(); // 继续导航
    }
});*/

