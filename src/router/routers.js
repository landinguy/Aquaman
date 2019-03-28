import Main from '@/components/common/main/Main'
import parentView from '@/components/common/parent-view'

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/components/common/login/Login')
  },
  {
    path: '/',
    name: 'index',
    redirect: '/login',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
  },
  {
    path: '/school',
    name: 'school',
    meta: {
      hide: true,
    },
    component: Main,
    children: [
      {
        path: '/info',
        name: 'info',
        meta: {
          title: '首页'
        },
        component: () => import('@/components/school/Info')
      }
    ]
  },
  {
    path: '/account',
    name: 'account',
    meta: {
      title: '用户管理'
    },
    component: Main,
    children: [
      {
        path: 'students',
        name: 'students',
        meta: {
          title: '学生管理',
        },
        component: () => import('@/components/account/StudentList')
      },
      {
        path: 'teachers',
        name: 'teachers',
        meta: {
          title: '教师管理',
        },
        component: () => import('@/components/account/TeacherList')
      },
    ]
  },
]
