import {forEach, hasOneOf} from '@/libs/tools'
import {Spin} from "iview";

export const hasChild = (item) => {
  return item.children && item.children.length !== 0
}

const showThisMenuEle = (item, access) => {
  if (item.meta && item.meta.access && item.meta.access.length) {
    if (hasOneOf(item.meta.access, access)) return true
    else return false
  } else return true
}
/**
 * @param {Array} list 通过路由列表得到菜单列表
 * @returns {Array}
 */
export const getMenuByRouter = (list, access) => {
  let res = []
  forEach(list, item => {
    if (item.meta && !item.meta.hideInMenu) {
      let obj = {
        icon: (item.meta && item.meta.icon) || '',
        name: item.name,
        meta: item.meta,
        // type: item.type
      }
      if (hasChild(item) && showThisMenuEle(item, access)) {
        obj.children = getMenuByRouter(item.children, access)
      }
      if (showThisMenuEle(item, access)) res.push(obj)
    }
  })
  return res
}

/**
 * @param {Array} routeMetched 当前路由metched
 * @returns {Array}
 */
export const getBreadCrumbList = (routeMetched) => {
  let res = routeMetched.filter(item => {
    return item.meta === undefined || !item.meta.hide
  }).map(item => {
    let obj = {
      icon: (item.meta && item.meta.icon) || '',
      name: item.name,
      meta: item.meta
    }
    return obj
  })
  res = res.filter(item => {
    return !item.meta.hideInMenu
  })
  return res;
  // return [{
  //   name: '首页',
  //   to: '/home'
  // }, ...res]
}

export const showTitle = (item) => (item.meta && item.meta.title) || item.name

/**
 * @description 本地存储和获取标签导航列表
 */
export const setTagNavListInLocalstorage = list => {
  localStorage.tagNaveList = JSON.stringify(list)
}
/**
 * @returns {Array} 其中的每个元素只包含路由原信息中的name, path, meta三项
 */
export const getTagNavListFromLocalstorage = () => {
  const list = localStorage.tagNaveList
  return list ? JSON.parse(list) : []
}

/**
 * @param {Array} routers 路由列表数组
 * @description 用于找到路由列表中name为home的对象
 */
export const getHomeRoute = routers => {
  let i = -1
  let len = routers.length
  let homeRoute = {}
  while (++i < len) {
    let item = routers[i]
    if (item.children && item.children.length) {
      let res = getHomeRoute(item.children)
      if (res.name) return res
    } else {
      if (item.name === 'home') homeRoute = item
    }
  }
  return homeRoute
}

/**
 * @param {*} list 现有标签导航列表
 * @param {*} newRoute 新添加的路由原信息对象
 * @description 如果该newRoute已经存在则不再添加
 */
export const getNewTagList = (list, newRoute) => {
  const {name, path, meta} = newRoute
  let newList = [...list]
  if (newList.findIndex(item => item.name === name) >= 0) return newList
  else newList.push({name, path, meta})
  return newList
}

/**
 * @param {Boolean} status 状态 1 => locked  0 => unlocked
 * @description 这里只是为了演示，实际应该将锁定状态的设置和获取用接口来实现
 */
export const setLockStatus = (status) => {
  localStorage.isLocked = status
}
export const getLockStatus = () => {
  return parseInt(localStorage.isLocked)
}

/**
 * @param {*} access 用户权限数组，如 ['super_admin', 'admin']
 * @param {*} route 路由列表
 */
const hasAccess = (access, route) => {
  if (route.meta && route.meta.access) return hasOneOf(access, route.meta.access)
  else return true
}

/**
 * @param {*} name 即将跳转的路由name
 * @param {*} access 用户权限数组
 * @param {*} routes 路由列表
 * @description 用户是否可跳转到该页
 */
export const canTurnTo = (name, access, routes) => {
  const getHasAccessRouteNames = (list) => {
    let res = []
    list.forEach(item => {
      if (item.children && item.children.length) {
        res = [].concat(res, getHasAccessRouteNames(item.children))
      } else {
        if (item.meta && item.meta.access) {
          if (hasAccess(access, item)) res.push(item.name)
        } else {
          res.push(item.name)
        }
      }
    })
    return res
  }
  const canTurnToNames = getHasAccessRouteNames(routes)
  return canTurnToNames.indexOf(name) > -1
}

/**
 * @param {String} url
 * @description 从URL中解析参数
 */
export const getParams = url => {
  const keyValueArr = url.split('?')[1].split('&')
  let paramObj = {}
  keyValueArr.forEach(item => {
    const keyValue = item.split('=')
    paramObj[keyValue[0]] = keyValue[1]
  })
  return paramObj
}

/**
 * @param {Array} list 标签列表
 * @param {String} name 当前关闭的标签的name
 */
export const getNextName = (list, name) => {
  let res = ''
  if (list.length === 2) {
    res = 'home'
  } else {
    if (list.findIndex(item => item.name === name) === list.length - 1) res = list[list.length - 2].name
    else res = list[list.findIndex(item => item.name === name) + 1].name
  }
  return res
}

/**
 * @param {Number} times 回调函数需要执行的次数
 * @param {Function} callback 回调函数
 */
export const doCustomTimes = (times, callback) => {
  let i = -1
  while (++i < times) {
    callback()
  }
}

/**
 * @param {Object} file 从上传组件得到的文件对象
 * @returns {Promise} resolve参数是解析后的二维数组
 * @description 从Csv文件中解析出表格，解析成二维数组
 */
export const getArrayFromFile = (file) => {
  let nameSplit = file.name.split('.')
  let format = nameSplit[nameSplit.length - 1]
  return new Promise((resolve, reject) => {
    let reader = new FileReader()
    reader.readAsText(file) // 以文本格式读取
    let arr = []
    reader.onload = function (evt) {
      let data = evt.target.result // 读到的数据
      let pasteData = data.trim()
      arr = pasteData.split((/[\n\u0085\u2028\u2029]|\r\n?/g)).map(row => {
        return row.split('\t')
      }).map(item => {
        return item[0].split(',')
      })
      if (format === 'csv') resolve(arr)
      else reject(new Error('[Format Error]:你上传的不是Csv文件'))
    }
  })
}

/**
 * @param {Array} array 表格数据二维数组
 * @returns {Object} { columns, tableData }
 * @description 从二维数组中获取表头和表格数据，将第一行作为表头，用于在iView的表格中展示数据
 */
export const getTableDataFromArray = (array) => {
  let columns = []
  let tableData = []
  if (array.length > 1) {
    let titles = array.shift()
    columns = titles.map(item => {
      return {
        title: item,
        key: item
      }
    })
    tableData = array.map(item => {
      let res = {}
      item.forEach((col, i) => {
        res[titles[i]] = col
      })
      return res
    })
  }
  return {
    columns,
    tableData
  }
}

/**
 * 完整显示表格数据
 * @param h
 * @param t
 * @returns {*}
 */
export const showTip = (h, t) => {
  if (!t) t = "----";
  return h("div", {attrs: {title: t}}, t)
};

/**
 * 时间戳转日期
 * @param timestamp
 * @returns {*}
 */
export const timestampToTime = (timestamp) => {
  if (!timestamp) return "----";
  var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  var i = date.getMinutes();
  i = i < 10 ? ('0' + i) : i;
  var s = date.getSeconds();
  s = s < 10 ? ('0' + s) : s;
  return y + '-' + m + '-' + d + ' ' + h + ':' + i + ':' + s;
};
export const validateNumber = (rule, value, callback) => {
  if (isNaN(value)) {
    callback(new Error("请输入数字"));
  } else if (value < 0) {
    callback(new Error("请输入正整数"));
  } else {
    callback()
  }
};

/*** 加载中效果 ***/
export const handleSpinCustom = () => {
  Spin.show({
    render: (h) => {
      return h('div', [
        h('Icon', {
          style: 'animation: ani-demo-spin 1s linear infinite',
          props: {
            type: 'load-c',
            size: 72
          }
        }),
        h('div', '正在加载中......')
      ])
    }
  })
}
