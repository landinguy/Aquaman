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
      access: ['PRESIDENT', 'GRADE_LEADER', 'CLASS_TEACHER', 'TEACHER']
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
    path: '/school',
    name: 'school',
    meta: {
      hide: true,
      access: ['SUPER']
    },
    component: Main,
    children: [
      {
        path: '/list',
        name: 'list',
        meta: {
          title: '学校管理'
        },
        component: () => import('@/components/school/List')
      }
    ]
  },
  {
    path: '/AdminAccount',
    name: 'AdminAccount',
    meta: {
      hide: true,
      access: ['SUPER']
    },
    component: Main,
    children: [
      {
        path: '/accounts',
        name: 'accounts',
        meta: {
          title: '账号管理'
        },
        component: () => import('@/components/account/AdminList')
      }
    ]
  },
  {
    path: '/account',
    name: 'account',
    meta: {
      title: '用户管理',
      access: ['ADMIN']
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
  {
    path: '/schoolManage',
    name: 'schoolManage',
    meta: {
      title: '学校管理',
      access: ['ADMIN', 'PRESIDENT', 'GRADE_LEADER']
    },
    component: Main,
    children: [
      {
        path: 'gradeManage',
        name: 'gradeManage',
        meta: {
          title: '年级管理',
          access: ['ADMIN', 'PRESIDENT', 'GRADE_LEADER']
        },
        component: () => import('@/components/grade/List')
      },
      {
        path: 'classManage',
        name: 'classManage',
        meta: {
          title: '班级管理',
          access: ['ADMIN', 'PRESIDENT', 'GRADE_LEADER']
        },
        component: () => import('@/components/class/List')
      },
    ]
  },
  {
    path: '/homeworkManage',
    name: 'homeworkManage',
    meta: {
      title: '作业管理',
      access: ['ADMIN']
    },
    component: Main,
    children: [
      {
        path: 'homework',
        name: 'homework',
        meta: {
          title: '布置作业',
          access: ['ADMIN']
        },
        component: () => import('@/components/homework/List')
      }
    ]
  },
  {
    path: '/analysis',
    name: 'analysis',
    meta: {
      title: '数据分析',
      access: ['PRESIDENT', 'GRADE_LEADER', 'CLASS_TEACHER', 'TEACHER']
    },
    component: Main,
    children: [
      {
        path: 'overview',
        name: 'overview',
        meta: {
          title: '作业总览',
          access: ['PRESIDENT']
        },
        component: () => import('@/components/analysis/overview/Overview')
      },
      {
        path: 'statistics',
        name: 'statistics',
        meta: {
          title: '数据统计',
          access: ['PRESIDENT']
        },
        component: () => import('@/components/analysis/statistics/Statistics')
      },
      {
        path: 'statistic',
        name: 'statistic',
        meta: {
          title: '数据总览',
          access: ['TEACHER']
        },
        component: () => import('@/components/analysis/statistics/TeacherStatistics')
      },
      {
        path: 'subject',
        name: 'subject',
        meta: {
          title: '科目分析',
          access: ['GRADE_LEADER']
        },
        component: () => import('@/components/analysis/subject/Subject')
      },
      {
        path: 'grade',
        name: 'grade',
        meta: {
          title: '年级分析',
          access: ['GRADE_LEADER']
        },
        component: () => import('@/components/analysis/grade/Grade')
      },
      {
        path: 'clazz',
        name: 'clazz',
        meta: {
          title: '班级分析',
          access: ['CLASS_TEACHER']
        },
        component: () => import('@/components/analysis/clazz/Clazz')
      },
      {
        path: 'teacher',
        name: 'teacher',
        meta: {
          title: '教师分析',
          access: ['CLASS_TEACHER']
        },
        component: () => import('@/components/analysis/teacher/Teacher')
      },
      {
        path: 'student',
        name: 'student',
        meta: {
          title: '学生分析',
          access: ['CLASS_TEACHER']
        },
        component: () => import('@/components/analysis/student/Student')
      }
    ]
  },
]
