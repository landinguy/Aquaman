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
    path: '/goods',
    name: 'goods',
    meta: {
      hide: true,
      title: '商品管理'
      // access: ['ADMIN']
    },
    component: Main,
    children: [
      {
        path: '/goods_type',
        name: 'goods_type',
        meta: {
          title: '商品类别',
          access: ['ADMIN']
        },
        component: () => import('@/components/goods/type/Info')
      },
      {
        path: '/goods_list',
        name: 'goods_list',
        meta: {
          title: '商品列表'
        },
        component: () => import('@/components/goods/Info')
      }
    ]
  },
  {
    path: '/order',
    name: 'order',
    meta: {
      hide: true,
      title: '订单管理'
      // access: ['ADMIN']
    },
    component: Main,
    children: [
      {
        path: '/order_list',
        name: 'order_list',
        meta: {
          title: '订单列表'
        },
        component: () => import('@/components/order/Info')
      }
    ]
  },
  {
    path: '/transaction',
    name: 'transaction',
    meta: {
      hide: true,
      title: '交易管理'
    },
    component: Main,
    children: [
      {
        path: '/transaction_info',
        name: 'transaction_info',
        meta: {
          title: '交易管理'
        },
        component: () => import('@/components/transaction/Info')
      }
    ]
  },
  {
    path: '/bill',
    name: 'bil',
    meta: {
      hide: true,
      title: '账单管理',
      access: ['ADMIN']
    },
    component: Main,
    children: [
      {
        path: '/bill_list',
        name: 'bill_list',
        meta: {
          title: '账单管理'
        },
        component: () => import('@/components/bill/Info')
      }
    ]
  },


]
