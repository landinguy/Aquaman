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
  // {
  //   path: '/account',
  //   name: 'account',
  //   meta: {
  //     hide: true,
  //     access: ['ADMIN']
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: '/account',
  //       name: 'account',
  //       meta: {
  //         title: '用户管理'
  //       },
  //       component: () => import('@/components/account/Info')
  //     }
  //   ]
  // },
  {
    path: '/file',
    name: 'file',
    meta: {
      hide: true,
      // access: ['ADMIN']
    },
    component: Main,
    children: [
      {
        path: '/file',
        name: 'file',
        meta: {
          title: '文件管理'
        },
        component: () => import('@/components/file/Info')
      }
    ]
  }
]
