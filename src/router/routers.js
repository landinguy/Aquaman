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
        component: () => import('@/components/home/Home')
      }
    ]
  },
  {
    path: '/analysis',
    name: 'analysis',
    meta: {
      title: '分析管理',
    },
    component: Main,
    children: [
      {
        path: 'subject',
        name: 'subject',
        meta: {
          title: '科目分析'
        },
        component: () => import('@/components/analysis/subject/Subject')
      },
      {
        path: 'grade',
        name: 'grade',
        meta: {
          title: '年级分析'
        },
        component: () => import('@/components/analysis/grade/Grade')
      },
      {
        path: 'clazz',
        name: 'clazz',
        meta: {
          title: '班级分析'
        },
        component: () => import('@/components/analysis/clazz/Clazz')
      },
      {
        path: 'teacher',
        name: 'teacher',
        meta: {
          title: '教师分析'
        },
        component: () => import('@/components/analysis/teacher/Teacher')
      },
      {
        path: 'student',
        name: 'student',
        meta: {
          title: '学生分析'
        },
        component: () => import('@/components/analysis/student/Student')
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
        path: 'addSchool',
        name: 'addSchool',
        meta: {
          title: '添加学校',
        },
        component: () => import('@/components/system/school/Add')
      },
      {
        path: 'addGrade',
        name: 'addGrade',
        meta: {
          title: '添加年级',
        },
        component: () => import('@/components/system/grade/Add')
      },
      {
        path: 'addClass',
        name: 'addClass',
        meta: {
          title: '添加班级',
        },
        component: () => import('@/components/system/class/Add')
      },
      {
        path: 'addAccount',
        name: 'addAccount',
        meta: {
          title: '添加账号',
        },
        component: () => import('@/components/system/account/Add')
      },
      {
        path: 'accountList',
        name: 'accountList',
        meta: {
          title: '账号列表',
        },
        component: () => import('@/components/system/account/List')
      },
      // {
      //   path: 'teacher',
      //   name: 'teacherManage',
      //   meta: {
      //     title: '教师管理',
      //   },
      //   component: () => import('@/components/system/teacher/Teacher')
      // },
      // {
      //   path: 'student',
      //   name: 'studentManage',
      //   meta: {
      //     title: '学生管理',
      //   },
      //   component: () => import('@/components/system/student/Student')
      // }
    ]
  }
]
