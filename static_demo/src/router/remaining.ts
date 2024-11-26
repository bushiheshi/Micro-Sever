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
        path: '/login',
        name: 'login',
        meta: {
            title: '主页',
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
        path:'/home',
        name:'home',
        component:()=>import('@/views/HomePage/index.vue'),
        meta: {
            title: '首页',
            icon: 'home',
            hidden: true
        },
    }


]
