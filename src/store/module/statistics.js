import { statisticsCount,statisticsList,statisticsDetailCount,statisticsDetailList,statisticsAnalysis,statisticsAccounts } from '@/api/statistics'
export default {
  state: {
    statsCount:0,
    statsList:[],
    statsDetailCount:0,
    statsDetailList:[],
    statsAnalysis:{},
    statsAccounts:[],
  },
  mutations: {
    setStatsCount (state, statsCount) {
      state.statsCount = statsCount;
    },
    setStatsList (state, statsList) {
      state.statsList = statsList;
    },
    setStatsDetailCount (state, statsDetailCount) {
      state.statsDetailCount = statsDetailCount;
    },
    setStatsDetailList (state, statsDetailList) {
      state.statsDetailList = statsDetailList;
    },
    setStatsAnalysis (state, statsAnalysis) {
      state.statsAnalysis = statsAnalysis;
    },
    setStatsAccounts (state, statsAccounts) {
      state.statsAccounts = statsAccounts;
    }
  },

  actions: {

    handleStatisticsCount({commit}, {st, et, accountId,find,userName}) {
      return new Promise((resolve, reject) => {
        statisticsCount({
          st, et, accountId,find,userName
        }).then(res => {
          commit('setStatsCount', res.data)
          resolve(res)
        }).catch(err => {
          commit('setStatsCount', 50)
          reject(err)
        })
      })
    },

    handleStatisticsList({commit}, {st,et,page,pageSize,accountId,find,userName}) {
      return new Promise((resolve, reject) => {
        statisticsList({st,et,page,pageSize,accountId,find,userName}
        ).then(res => {
          commit('setStatsList', res.data)
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      });
    },
    handleStatisticsDetailCount({commit}, {st, et, accountId, find,tel,userName}) {
      return new Promise((resolve, reject) => {
        statisticsDetailCount({st, et, accountId,find,tel,userName}).then(res => {
          commit('setStatsDetailCount', res.data)
          resolve()
        }).catch(err => {
          commit('setStatsDetailCount', 0)
          reject(err)
        })
      })
    },

    handleStatisticsDetailList({commit}, {st,et,page,pageSize,accountId, find,tel,userName,next,locativeId}) {
      return new Promise((resolve, reject) => {
        statisticsDetailList({st,et,page,pageSize,accountId, find,tel,userName,next,locativeId}
        ).then(res => {
          commit('setStatsDetailList', res.data);
          resolve(res);
        }).catch(err => {
          reject(err)
        })
      })
    },

    handleStatisticsAnalysis({commit}, {accountId,st,et,find, type}) {
      return new Promise((resolve, reject) => {
        statisticsAnalysis({accountId,st,et,find,type}
        ).then(res => {
          commit('setStatsAnalysis', res.data);
          resolve(res);
        }).catch(err => {
          reject(err)
        })
      })
    },


    handleStatisticsAccounts({commit}, {accountId}) {
      return new Promise((resolve, reject) => {
        statisticsAccounts({accountId}
        ).then(res => {
          commit('setStatsAccounts', res.data);
          resolve(res);
        }).catch(err => {
          reject(err)
        })
      })
    },

  }
}
