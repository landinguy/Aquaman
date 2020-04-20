import Main from '@/components/common/main/Main'

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
    path: '/examination',
    name: 'examination',
    meta: {
      hide: true,
      // access: ['ADMIN', 'JGS', 'USER']
    },
    component: Main,
    children: [
      {
        path: '/examination',
        name: 'examination',
        meta: {
          title: '题库管理'
        },
        component: () => import('@/components/examination/Info')
      }
    ]
  },
  {
    path: '/paper',
    name: 'paper',
    meta: {
      hide: true,
      access: ['ADMIN', 'TEACHER', 'COMPANY']
    },
    component: Main,
    children: [
      {
        path: '/paper',
        name: 'paper',
        meta: {
          title: '试卷管理'
        },
        component: () => import('@/components/paper/Info')
      }
    ]
  },
  {
    path: '/publish',
    name: 'publish',
    meta: {
      hide: true
    },
    component: Main,
    children: [
      {
        path: '/publish',
        name: 'publish',
        meta: {
          title: '发布记录'
        },
        component: () => import('@/components/publish/Info')
      }
    ]
  },
  {
    path: '/reply',
    name: 'reply',
    meta: {
      hide: true
    },
    component: Main,
    children: [
      {
        path: '/reply',
        name: 'reply',
        meta: {
          title: '答题记录'
        },
        component: () => import('@/components/reply/Info')
      }
    ]
  }
]
