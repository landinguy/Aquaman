import {
  getBreadCrumbList,
  setTagNavListInLocalstorage,
  getMenuByRouter,
  getTagNavListFromLocalstorage,
  getHomeRoute
} from '@/libs/util'
import routers from '@/router/routers'

export default {
  state: {
    breadCrumbList: [],
    tagNavList: [],
    homeRoute: getHomeRoute(routers),
    tabFlag: 0
  },
  getters: {
    menuList: (state, getters, rootState) => getMenuByRouter(routers, rootState.user.access),
    tabFlag: state => {
      state.tabFlag = state.tabFlag;
      return state.tabFlag = sessionStorage.getItem("tabFlag");
    }
  },
  mutations: {
    setTabFlag(state, n) {
      state.tabFlag = n;
      if (n == 0 || n == 1) {
        //0标识超信的接口
        sessionStorage.setItem("tab", 0)
      }
      else {
        //1标识短信的接口
        sessionStorage.setItem("tab", 1)
      }
      sessionStorage.setItem("tabFlag", n);
    },
    setBreadCrumb(state, routeMetched) {
      state.breadCrumbList = getBreadCrumbList(routeMetched)
    },
    setTagNavList(state, list) {
      if (list) {
        state.tagNavList = [...list]
        setTagNavListInLocalstorage([...list])
      } else state.tagNavList = getTagNavListFromLocalstorage()
    },
    addTag(state, item, type = 'unshift') {
      if (state.tagNavList.findIndex(tag => tag.name === item.name) < 0) {
        if (type === 'push') state.tagNavList.push(item)
        else state.tagNavList.unshift(item)
        setTagNavListInLocalstorage([...state.tagNavList])
      }
    }
  }
}
