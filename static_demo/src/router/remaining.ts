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


]
