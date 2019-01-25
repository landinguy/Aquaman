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
          title: '作业总览'
        },
        component: () => import('@/components/index/home/Home')
      }
    ]
  },
  {
    path: '/subject',
    name: 'subject',
    meta: {
      hide: true,
    },
    component: Main,
    children: [
      {
        path: '/subject',
        name: 'subject',
        meta: {
          title: '科目分析'
        },
        component: () => import('@/components/index/subject/Subject')
      }
    ]
  },
  {
    path: '/grade',
    name: 'grade',
    meta: {
      hide: true,
    },
    component: Main,
    children: [
      {
        path: '/grade',
        name: 'grade',
        meta: {
          title: '年级分析'
        },
        component: () => import('@/components/index/grade/Grade')
      }
    ]
  },
  {
    path: '/teacher',
    name: 'teacher',
    meta: {
      hide: true,
    },
    component: Main,
    children: [
      {
        path: '/teacher',
        name: 'teacher',
        meta: {
          title: '教师分析'
        },
        component: () => import('@/components/index/teacher/Teacher')
      }
    ]
  },
  {
    path: '/student',
    name: 'student',
    meta: {
      hide: true,
    },
    component: Main,
    children: [
      {
        path: '/student',
        name: 'student',
        meta: {
          title: '学生分析'
        },
        component: () => import('@/components/index/student/Student')
      }
    ]
  },
  {
    path: '/system',
    name: 'system',
    meta: {
      title: '系统管理',
    },
    component: Main,
    children: [
      {
        path: 'school',
        name: 'schoolManage',
        meta: {
          title: '学校管理',
        },
        component: () => import('@/components/index/system/school/School')
      },
      {
        path: 'grade',
        name: 'gradeManage',
        meta: {
          title: '年级管理',
        },
        component: () => import('@/components/index/system/grade/Grade')
      },
      {
        path: 'class',
        name: 'classManage',
        meta: {
          title: '班级管理',
        },
        component: () => import('@/components/index/system/class/Class')
      },
      {
        path: 'teacher',
        name: 'teacherManage',
        meta: {
          title: '教师管理',
        },
        component: () => import('@/components/index/system/teacher/Teacher')
      },
      {
        path: 'student',
        name: 'studentManage',
        meta: {
          title: '学生管理',
        },
        component: () => import('@/components/index/system/student/Student')
      }
    ]
  },
  // {
  //   path: '/account',
  //   name: 'account',
  //   meta: {
  //     title: '账户管理',
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'account_info',
  //       name: 'account_info',
  //       meta: {
  //         title: '账户信息',
  //       },
  //       component: () => import('@/components/index/account/Account.vue')
  //     },
  //     {
  //       path: 'child_account',
  //       name: 'child_account',
  //       meta: {
  //         title: '账户权限管理',
  //         // access: ['0']
  //       },
  //       component: () => import('@/components/index/account/SubAccount.vue')
  //     }
  //   ]
  // },
]
