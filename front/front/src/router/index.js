import {
    createRouter,
    createWebHashHistory
} from 'vue-router'
import store from '@/store/index.js'

import managerHome from '../views/manager/managerHome.vue'
import login from '../views/patient/login.vue'
import patientHome from '../views/patient/Layout/patientHome.vue'
import PatientDetail from '@/views/manager/patientDetail.vue'

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
    },
    {
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
]





// 创建router 实例, 并暴露
export const router = createRouter({
    history: createWebHashHistory(),
    routes: routers
})

