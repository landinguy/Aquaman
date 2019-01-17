import { mainAccountInfo,updateNickName,updatePassword,updateAccountInfo,resetApiSecret } from '@/api/account'
export default {
  state: {
    accountNumber:"",
    companyName:"",
    createTs:"",
    nickname:"",
    tmplAuditCallbackUrl:"",
    signatureCallbackUrl:"",

    email:"",
    tel:"",
    name:"",
    scopes:"",
    companyWebsite:"",
    access:"",
    apiKey:"",
    apiSecret:""
  },
  mutations: {
    setAccountInfo (state, accountInfo) {
      state.accountNumber = accountInfo.accountNumber;
      state.companyName = accountInfo.companyName;
      state.createTs = accountInfo.createTs;
      state.nickname = accountInfo.nickname;
      state.tmplAuditCallbackUrl = accountInfo.tmplAuditCallbackUrl;
      state.signatureCallbackUrl =  accountInfo.signatureCallbackUrl;

      state.email = accountInfo.email;
      state.tel = accountInfo.tel;
      state.name = accountInfo.name;
      state.scopes = accountInfo.scopes;
      state.companyWebsite = accountInfo.companyWebsite;
      state.access = accountInfo.access;
      state.apiKey = accountInfo.apiKey;
      state.apiSecret = accountInfo.apiSecret;
    },

    setApiSecret (state, apiSecret) {
      state.apiSecret = apiSecret;
    }

  },

  actions: {

    handleMainAccountInfo ({ commit }, {accountNumber}) {
      return new Promise((resolve, reject) => {
        mainAccountInfo({
          accountNumber,
        }).then(res => {

          const accountInfo = res.data;
          commit('setAccountInfo', accountInfo)

          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    handleUpdateNickName ({ commit }, { accountId, nickname}) {
      return new Promise((resolve, reject) => {
        updateNickName({ accountId, nickname}
        ).then(res => {
          resolve()
        }).catch(err => {

          reject(err)
        })
      })
    },

    handleUpdatePassword ({ commit }, {accountId,oriPwd, pwd}) {
      return new Promise((resolve, reject) => {
        updatePassword({accountId,oriPwd,pwd}
        ).then(res => {
          resolve(res)
        }).catch(err => {

          reject(err)
        })
      })
    },

    handleUpdateAccountInfo ({ commit }, {accountNumber,email,tel,name,scopes,companyWebsite}) {
      return new Promise((resolve, reject) => {
        updateAccountInfo({ accountNumber,email,tel,name,scopes,companyWebsite}
        ).then(res => {

          resolve()
        }).catch(err => {

          reject(err)
        })
      })
    },

    handleResetApiSecret ({ commit }, {accountId}) {
      return new Promise((resolve, reject) => {
        resetApiSecret({ accountId}
        ).then(res => {
          console.log("-----------",res)
          const apiSecret = res.data;
          commit('setApiSecret', apiSecret)
          resolve(res)
        }).catch(err => {
          console.log("***********",err)
          reject(err)
        })
      })
    },
  }
}
