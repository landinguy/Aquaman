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
    type: 0,
    meta: {
      hide: true,
    },
    component: Main,
    children: [
      {
        path: '/home_index',
        name: 'home_index',
        meta: {
          title: '首页'
        },
        component: () => import('@/components/index/home/Home')
      }
    ]
  },
  {
    path: '/account',
    name: 'account',
    type: 0,
    meta: {
      title: '账户管理',
    },
    component: Main,
    children: [
      {
        path: 'account_info',
        name: 'account_info',
        meta: {
          title: '账户信息',
        },
        component: () => import('@/components/index/account/Account.vue')
      },
      {
        path: 'child_account',
        name: 'child_account',
        meta: {
          title: '账户权限管理',
          // access: ['0']
        },
        component: () => import('@/components/index/account/SubAccount.vue')
      }
    ]
  },
  {
    path: '/test',
    name: 'test',
    type: 0,
    meta: {
      title: '测试',
    },
    component: Main,
    children: [
      {
        path: 'testPage',
        name: 'testPage',
        meta: {
          title: '测试页面1',
        },
        component: () => import('@/components/index/test/Test.vue')
      },
      {
        path: 'testPage1',
        name: 'testPage1',
        meta: {
          title: '测试页面2',
        },
        component: () => import('@/components/index/test/Test.vue')
      }
    ]
  }
]
