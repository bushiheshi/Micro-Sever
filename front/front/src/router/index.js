import {
    createRouter,
    createWebHashHistory
} from 'vue-router'
import store from '@/store/index.js'

// 使用动态导入
const AdminLayout = () => import('@/layouts/AdminLayout.vue')
const managerHome = () => import('../views/manager/managerHome.vue')
const login = () => import('../views/patient/login.vue')
const patientHome = () => import('../views/patient/Layout/patientHome.vue')
const PatientDetail = () => import('@/views/manager/patientDetail.vue')
const DoctorManagement = () => import('@/views/manager/DoctorManagement.vue')
const doctor = () => import('../views/doctor/doctor.vue')
const doctorLogin = () => import('../views/doctor/doctorLogin.vue')
const WorkSchedule = () => import('@/views/doctor/WorkSchedule.vue')

const routers = [
    {
        path: '/',
        redirect: '/role-select'
    },
    {
        path: '/role-select',
        name: 'RoleSelect',
        component: () => import('@/views/RoleSelect.vue'),
        meta: {
            title: '身份选择',
            requiresAuth: false
        }
    },
    // 患者相关路由
    {
        path: '/login',
        name: 'login',
        component: login,
        meta: {
            title: '患者登录',
            requiresAuth: false,
            role: 'patient'
        }
    },
    {
        path: '/patientHome',
        name: 'patientHome',
        component: patientHome,
        meta: {
            title: '患者主页',
            requiresAuth: true,
            role: 'patient'
        }
    },
    // 医生相关路由
    {
        path: '/doctorLogin',
        name: 'doctorLogin',
        component: doctorLogin,
        meta: {
            title: '医生登录',
            requiresAuth: false,
            role: 'doctor'
        }
    },
    {
        path: '/doctor',
        name: 'doctor',
        component: doctor,
        meta: {
            title: '医生主页',
            requiresAuth: true,
            role: 'doctor'
        }
    },
    // 管理员相关路由
    {
        path: '/admin/login',
        name: 'AdminLogin',
        component: () => import('@/views/admin/AdminLogin.vue'),
        meta: {
            title: '管理员登录',
            requiresAuth: false,
            role: 'admin'
        }
    },
    {
        path: '/',
        component: AdminLayout,
        meta: { 
            requiresAuth: true,
            role: 'admin'
        },
        children: [
            {
                path: 'managerHome',
                name: 'ManagerHome',
                component: () => import('@/views/manager/managerHome.vue'),
                meta: {
                    title: '预约管理',
                    requiresAuth: true,
                    role: 'admin'
                }
            },
            {
                path: 'doctor-list',
                name: 'DoctorManagement',
                component: () => import('@/views/manager/DoctorManagement.vue'),
                meta: {
                    requiresAuth: true,
                    title: '医生管理',
                    role: 'admin'
                }
            },
            {
                path: 'billing',
                name: 'DoctorSchedule',
                component: () => import('@/views/manager/DoctorSchedule.vue'),
                meta: {
                    requiresAuth: true,
                    title: '排班管理'
                }
            },
            {
                path: 'attention',
                name: 'AttentionManagement',
                component: () => import('@/views/manager/AttentionManagement.vue'),
                meta: { 
                    requiresAuth: true, 
                    role: 'manager',
                    title: '通告管理'
                }
            }
        ]
    },
    {
        path: '/patient/profile',
        name: 'PatientProfile',
        component: () => import('@/views/patient/Profile/index.vue'),
        meta: {
            title: '个人信息',
            requiresAuth: true,
            role: 'patient'
        }
    },
    {
        path: '/appointment',
        name: 'Appointment',
        component: () => import('@/views/patient/Appointment/index.vue'),
        meta: {
            title: '预约就诊',
            requiresAuth: true,
            role: 'patient'
        }
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes: routers
});

// 完善的路由守卫
router.beforeEach((to, from, next) => {
    // 获取所有类型的token
    const adminToken = localStorage.getItem('adminToken');
    const userToken = localStorage.getItem('userToken');
    const doctorToken = localStorage.getItem('doctorToken');
    
    // 设置页面标题
    if (to.meta.title) {
        document.title = `${to.meta.title} - 医生办公室预约系统`;
    }

    // 如果是前往身份选择页面，直接放行
    if (to.path === '/role-select') {
        next();
        return;
    }

    // 检查是否需要认证
    if (to.matched.some(record => record.meta.requiresAuth)) {
        const role = to.meta.role;
        let hasValidToken = false;
        
        // 检查token和角色
        if (role === 'admin' && adminToken) {
            hasValidToken = true;
        } else if (role === 'doctor' && doctorToken) {
            hasValidToken = true;
        } else if (role === 'patient' && userToken) {
            hasValidToken = true;
        }

        if (!hasValidToken) {
            // 未登录或token无效，重定向到对应的登录页面
            const loginPath = role === 'admin' ? '/admin/login' : 
                             role === 'doctor' ? '/doctorLogin' : '/login';
            next({ path: loginPath, query: { redirect: to.fullPath }});
        } else {
            next();
        }
    } else {
        // 不需要认证的路由
        // 如果已登录且访问登录页，重定向到对应的主页
        if (to.path.includes('login')) {
            if (to.path === '/admin/login' && adminToken) {
                next({ path: '/managerHome' });
            } else if (to.path === '/doctorLogin' && doctorToken) {
                next({ path: '/doctor' });
            } else if (to.path === '/login' && userToken) {
                next({ path: '/patientHome' });
            } else {
                next();
            }
        } else {
            next();
        }
    }
});

export default router;

