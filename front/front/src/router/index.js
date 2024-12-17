import {
    createRouter,
    createWebHashHistory
} from 'vue-router'
import store from '@/store/index.js'

import managerHome from '../views/manager/managerHome.vue'
import login from '../views/patient/login.vue'

const routers=[
    {
        path:"/managerHome",
        name:"ManagerHome",
        component:managerHome,
        meta:{
            title: "管理首页", // 用于设置页面标题或显示在面包屑导航中
            requiresAuth: true // 表示该路由需要用户认证
        }
    },
    {
        path:"/login",
        name:"login",
        component:login,
        meta:{
            title: "登录页面", 
            requiresAuth: false // 表示该路由需要用户认证
        }
    }
]





// 创建router 实例, 并暴露
export const router = createRouter({
    history: createWebHashHistory(),
    routes: routers
})

