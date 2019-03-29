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
    path: '/device',
    name: 'device',
    meta: {
      hide: true,
    },
    component: Main,
    children: [
      {
        path: '/device',
        name: 'device',
        meta: {
          title: '设备管理'
        },
        component: () => import('@/components/device/Info')
      }
    ]
  },
  {
    path: '/account',
    name: 'account',
    meta: {
      hide: true,
      access:['ADMIN']
    },
    component: Main,
    children: [
      {
        path: '/account',
        name: 'account',
        meta: {
          title: '用户管理'
        },
        component: () => import('@/components/account/Info')
      }
    ]
  },
  // {
  //   path: '/account',
  //   name: 'account',
  //   meta: {
  //     title: '用户管理'
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'students',
  //       name: 'students',
  //       meta: {
  //         title: '学生管理',
  //       },
  //       component: () => import('@/components/account/StudentList')
  //     },
  //     {
  //       path: 'teachers',
  //       name: 'teachers',
  //       meta: {
  //         title: '教师管理',
  //       },
  //       component: () => import('@/components/account/TeacherList')
  //     },
  //   ]
  // },
]
