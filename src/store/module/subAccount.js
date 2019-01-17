import { querySubAccountList,disableOrDeleteSubAccount,addSubAccount,modifySubAccount,addGroup,queryRelate } from '@/api/account'
export default {
  state: {
    subAccountList:[],
    ordAccountList:[]
  },
  mutations: {
    setSubAccountList (state, subAccountList) {
      state.subAccountList = subAccountList;
    },
    setOrdAccountList (state, ordAccountList) {
      state.ordAccountList = ordAccountList;
    }
  },

  actions: {

    handleQuerySubAccountList({commit}, {subaccountNickname,status}) {
      return new Promise((resolve, reject) => {
        querySubAccountList({subaccountNickname,status}
        ).then(res => {
          commit('setSubAccountList', res.data)
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    handleDisableOrDeleteSubAccount({commit}, {subaccountId, status}) {
      return new Promise((resolve, reject) => {
        disableOrDeleteSubAccount({subaccountId, status}
        ).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    handleAddSubAccount({commit}, {accountNumber,subaccountNumber, subaccountNickname,remark,pwd,roleId,stype,cpid,buid,superMsg,simpleMsg,uplinkCallbackUrl,sendCallbackUrl,signatureCallbackUrl,tmplAuditCallbackUrl}) {
      return new Promise((resolve, reject) => {
        addSubAccount({accountNumber,subaccountNumber, subaccountNickname,remark,pwd,roleId,stype,cpid,buid,superMsg,simpleMsg,uplinkCallbackUrl,sendCallbackUrl,signatureCallbackUrl,tmplAuditCallbackUrl}
        ).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    handleModifySubAccount({commit}, {accountNumber,subaccountId,subaccountNumber, subaccountNickname,remark,pwd,roleId,stype,cpid,buid,superMsg,simpleMsg,uplinkCallbackUrl,sendCallbackUrl,signatureCallbackUrl,tmplAuditCallbackUrl}) {
      return new Promise((resolve, reject) => {
        modifySubAccount({accountNumber,subaccountId,subaccountNumber, subaccountNickname,remark,pwd,roleId,stype,cpid,buid,superMsg,simpleMsg,uplinkCallbackUrl,sendCallbackUrl,signatureCallbackUrl,tmplAuditCallbackUrl}
        ).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    handleAddGroup({commit}, {accountId,groupName,members}) {
      return new Promise((resolve, reject) => {
        addGroup({accountId,groupName,members}
        ).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    handleQueryRelate({commit}, {accountId}) {
      return new Promise((resolve, reject) => {
        queryRelate({accountId}
        ).then(res => {
          commit('setOrdAccountList', res.data)

          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

  }
  }
