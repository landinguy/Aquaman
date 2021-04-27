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
      // access: ['ADMIN']
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
    path: '/goods',
    name: 'goods',
    meta: {
      hide: true,
      // access: ['ADMIN']
    },
    component: Main,
    children: [
      {
        path: '/goods',
        name: 'goods',
        meta: {
          title: '商品管理'
        },
        component: () => import('@/components/goods/Info')
      }
    ]
  },
  {
    path: '/purchase',
    name: 'purchase',
    meta: {
      hide: true,
      // access: ['ADMIN']
    },
    component: Main,
    children: [
      {
        path: '/purchase',
        name: 'purchase',
        meta: {
          title: '采购管理'
        },
        component: () => import('@/components/purchase/Info')
      }
    ]
  },
  // {
  //   path: '/storage',
  //   name: 'storage',
  //   meta: {
  //     hide: true,
  //     // access: ['ADMIN']
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: '/storage',
  //       name: 'storage',
  //       meta: {
  //         title: '仓储管理'
  //       },
  //       component: () => import('@/components/storage/Info')
  //     }
  //   ]
  // },
  // {
  //   path: '/sale',
  //   name: 'sale',
  //   meta: {
  //     hide: true,
  //     // access: ['ADMIN']
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: '/sale',
  //       name: 'sale',
  //       meta: {
  //         title: '销售管理'
  //       },
  //       component: () => import('@/components/sale/Info')
  //     }
  //   ]
  // },

]
