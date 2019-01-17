import {total, trend} from "../../api/home";
export default {
  state: {
    send: 0,
    sendSuc: 0,
    remain: 0,
    freeze: 0,
    statisticsRS:[],
    sortedData:[]
  },
  mutations: {
    setSend (state, send) {
      state.send = send
    },
    setSendSuc (state, sendSuc) {
      state.sendSuc = sendSuc
    },
    setRemain (state, remain) {
      state.remain = remain
    },
    setFreeze (state, freeze) {
      state.freeze = freeze
    },
    setStatisticsRS (state, statisticsRS) {
      state.statisticsRS = statisticsRS
    },
    setSortedData (state) {
      state.sortedData = state.statisticsRS.sort(function(a,b){
        var s = a.timePoint;
        var t = b.timePoint;
        if(s < t) return -1;
        if(s > t) return 1;
      })
    }
  },

  actions: {

    handleTotal ({ commit }, {accountId, st, et}) {
      return new Promise((resolve, reject) => {
        total({
          st,
          et,
          accountId
        }).then(res => {
          const send = res.data.send
          commit('setSend', send)

          const sendSuc = res.data.sendSuc
          commit('setSendSuc', sendSuc)

          const remain = res.data.remain
          commit('setRemain', remain)

          const freeze = res.data.freeze
          commit('setFreeze', freeze)
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    handleTrend ({ commit }, { accountId, st, et}) {
      return new Promise((resolve, reject) => {
        trend({
          st,
          et,
          accountId
        }).then(res => {
          const statisticsRS = res.data
          commit('setStatisticsRS', statisticsRS)
          commit('setSortedData')
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },

  }
}
