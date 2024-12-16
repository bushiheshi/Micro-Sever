import {
    createRouter,
    createWebHashHistory
} from 'vue-router'
import store from '@/store/index.js'

import managerHome from '../views/manager/managerHome.vue'

const routers=[
    {
        path:"/managerHome",
        name:"ManagerHome",
        component:managerHome,
        meta:{
            title: "管理首页", // 用于设置页面标题或显示在面包屑导航中
            requiresAuth: true // 表示该路由需要用户认证
        }
    }
]





// 创建router 实例, 并暴露
export const router = createRouter({
    history: createWebHashHistory(),
    routes: routers
})
// 路由守卫
router.beforeEach((to, from, next) => {
    const isAuthenticated = store.state.user || store.state.merchant ||store.state.rider;
    const requiresAuth = to.meta.requiresAuth; // 确保获取到目标路由的 requiresAuth 属性
    if (requiresAuth && !isAuthenticated) {
        next({ path: '/login' }); // 重定向到登录
    } else {
        next(); // 继续导航
    }
});
