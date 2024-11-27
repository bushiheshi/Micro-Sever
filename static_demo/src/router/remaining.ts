/*
 * @Date: 2024-11-20 20:20:29
 * @LastEditors: shubingsun 952217382@qq.com
 * @LastEditTime: 2024-11-20 20:47:24
 * @FilePath: \Micro-Sever\static_demo\src\router\remaining.ts
 */
export const remainingRouter: AppRouteRecordRaw[] = [
    // 路由重定向
    {
        path: '/',
        redirect: '/layout',
        name: 'Redirect',
        meta: {}
    },
    {
        path: '/patient',
        name: 'patient',
        meta: {
            title: '患者',
            icon: 'StarFilled',
            hidden: true
        },
        component: () => import('@/components/Layout/index.vue')
    },
    {
        path: '/loginOrSignup',
        name: 'loginOrSignup',
        meta: {
            title: '登录注册',
            hidden: true
        },
        component: () => import('@/views/LoginOrSignup/index.vue')
    },
    {
        path: '/home',
        name: 'home',
        component: () => import('@/views/manager/index.vue'),
        meta: {
            title: '首页',
            icon: 'home',
            hidden: true
        },
    },
    {
        path: '/doctor',
        name: 'doctor',
        component: () => import('@/doctor/doctor.vue'),
        meta: {
            title: '医生端',
            icon: 'doctor',
            hidden: true
        },
    }



]
