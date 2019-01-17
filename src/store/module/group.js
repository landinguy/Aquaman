import { addPhoneGroup,groupPhoneCount,groupPhoneList,groupPhoneModify,groupPhoneDelete } from "@/api/group"
export default {
  state: {
    groupPhoneCount:0,
    groupPhoneList:[]

  },
  mutations: {
    setGroupPhoneCount (state, groupPhoneCount) {
      state.groupPhoneCount = groupPhoneCount;
    },
    setGroupPhoneList (state, groupPhoneList) {
      state.groupPhoneList = groupPhoneList;
    }
  },

  actions: {

    handleAddPhoneGroup ({ commit }, {accountId,groupName, groupDesc,groupFileToken,dataType}) {
      return new Promise((resolve, reject) => {
        addPhoneGroup({
          accountId,groupName, groupDesc,groupFileToken,dataType
        }).then(res => {

          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    handleGroupPhoneCount ({ commit }, {accountId,groupName}) {
      return new Promise((resolve, reject) => {
        groupPhoneCount({
          accountId,groupName
        }).then(res => {
          const groupPhoneCount = res.data;
          commit('setGroupPhoneCount', groupPhoneCount)
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    handleGroupPhoneList ({ commit }, {accountId,groupName, pageNo,pageSize}) {
      return new Promise((resolve, reject) => {
        groupPhoneList({accountId,groupName, pageNo,pageSize}).then(res => {
          const groupPhoneList = res.data;
          commit('setGroupPhoneList', groupPhoneList)
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },



    handleGroupPhoneDelete ({ commit }, {accountId,groupId}) {
      return new Promise((resolve, reject) => {
        groupPhoneDelete({accountId,groupId}).then(res => {

          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },


    handleGroupPhoneModify ({ commit }, {accountId,groupName, groupId,groupDesc}) {
      return new Promise((resolve, reject) => {
        groupPhoneModify({accountId,groupName, groupId,groupDesc}).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
  }
}
