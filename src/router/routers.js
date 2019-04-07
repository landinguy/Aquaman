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
    path: '/home',
    name: 'home',
    meta: {
      hide: true,
    },
    component: Main,
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          title: '首页'
        },
        component: () => import('@/components/home/Home')
      }
    ]
  },
  {
    path: '/account',
    name: 'account',
    meta: {
      hide: true,
      access: ['ADMIN']
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
  {
    path: '/vehicle',
    name: 'vehicle',
    meta: {
      hide: true,
      access: ['ADMIN', 'JGS', 'USER']
    },
    component: Main,
    children: [
      {
        path: '/vehicle',
        name: 'vehicle',
        meta: {
          title: '车辆管理'
        },
        component: () => import('@/components/vehicle/Info')
      }
    ]
  },
  {
    path: '/record',
    name: 'record',
    meta: {
      hide: true,
    },
    component: Main,
    children: [
      {
        path: '/record',
        name: 'record',
        meta: {
          title: '违章管理'
        },
        component: () => import('@/components/record/Info')
      }
    ]
  },
  {
    path: '/log',
    name: 'log',
    meta: {
      hide: true,
      access: ['ADMIN']
    },
    component: Main,
    children: [
      {
        path: '/log',
        name: 'log',
        meta: {
          title: '登录日志'
        },
        component: () => import('@/components/log/Info')
      }
    ]
  }
]
