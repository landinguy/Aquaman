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
    path: '/account',
    name: 'account',
    meta: {
      title: '用户管理',
    },
    component: Main,
    children: [
      {
        path: 'addAccount',
        name: 'addAccount',
        meta: {
          title: '添加账号',
        },
        component: () => import('@/components/account/Add')
      },
      {
        path: 'students',
        name: 'students',
        meta: {
          title: '学生查询',
        },
        component: () => import('@/components/account/StudentList')
      },
      {
        path: 'teachers',
        name: 'teachers',
        meta: {
          title: '教师查询',
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
    },
    component: Main,
    children: [
      {
        path: 'gradeManage',
        name: 'gradeManage',
        meta: {
          title: '年级管理',
        },
        component: parentView,
        children: [
          {
            path: 'addGrade',
            name: 'addGrade',
            meta: {
              title: '添加年级',
            },
            component: () => import('@/components/grade/Add')
          },
          {
            path: 'grades',
            name: 'grades',
            meta: {
              title: '年级查询',
            },
            component: () => import('@/components/grade/List')
          },
        ]
      },
      {
        path: 'classManage',
        name: 'classManage',
        meta: {
          title: '班级管理',
        },
        component: parentView,
        children: [
          {
            path: 'addClass',
            name: 'addClass',
            meta: {
              title: '添加班级',
            },
            component: () => import('@/components/class/Add')
          },
          {
            path: 'classes',
            name: 'classes',
            meta: {
              title: '班级查询',
            },
            component: () => import('@/components/class/List')
          },
        ]
      },
    ]
  },
  {
    path: '/analysis',
    name: 'analysis',
    meta: {
      title: '数据分析',
    },
    component: Main,
    children: [
      {
        path: 'overview',
        name: 'overview',
        meta: {
          title: '作业总览'
        },
        component: () => import('@/components/analysis/overview/Overview')
      },
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
]
