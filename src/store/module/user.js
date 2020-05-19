import {login, logout} from '@/api/user'
import {Message} from 'iview'

export default {
  state: {
    accountId: '',
    accountNumber: '',
    accountNickname: '',
    roleId: '',
    access: "",
    phone: "",
    email: "",
  },
  mutations: {
    setAccountId(state, accountId) {
      state.accountId = accountId
      sessionStorage.setItem("accountId", accountId);
    },
    setAccountNumber(state, accountNumber) {
      state.accountNumber = accountNumber
      sessionStorage.setItem("accountNumber", accountNumber);
    },
    setAccountNickname(state, accountNickname) {
      state.accountNickname = accountNickname;
      sessionStorage.setItem("accountNickname", accountNickname);
    },
    setRoleId(state, roleId) {
      state.roleId = roleId;
      sessionStorage.setItem("roleId", roleId);
      state.access = roleId;
    },
    setPhone(state, phone) {
      state.phone = phone;
    },
    setEmail(state, email) {
      state.email = email;
    },
  },
  getters: {
    accountId: state => {
      state.accountId = state.accountId;
      return sessionStorage.getItem("accountId");
    },
    accountNumber: state => {
      state.accountNumber = state.accountNumber;
      return sessionStorage.getItem("accountNumber")
    },
    roleId: state => {
      state.roleId = state.roleId;
      state.access = sessionStorage.getItem("roleId");
      return sessionStorage.getItem("roleId")
    },
    accountNickname: state => {
      state.accountNickname = state.accountNickname;
      return sessionStorage.getItem("accountNickname")
    },
    accessToken: state => {
      state.accessToken = state.accessToken;
      return sessionStorage.getItem("accessToken")
    },
    phone: state => state.phone,
    email: state => state.email
  },

  actions: {
    updateNickName({commit}, {accountNickname}) {
      commit('setAccountNickname', accountNickname);
    },
    // 登录
    handleLogin({commit}, {username, password}) {
      return new Promise((resolve, reject) => {
        login({
          username,
          password
        }).then(res => {
          let data = res.data;
          if (data && data.code === 0) {
            const {uid, username, role, phone, email} = data.data;
            commit('setAccountId', uid);
            commit('setAccountNickname', username);
            commit('setRoleId', role);
            commit('setPhone', phone);
            commit('setEmail', email);
            resolve(res)
          } else {
            Message.error(data.msg);
            reject(res)
          }
        }).catch(err => reject(err))
      })
    },
    // 退出登录
    handleLogOut({state, commit}) {
      return new Promise((resolve, reject) => {
        logout().then(res => {
          sessionStorage.removeItem('accountId');
          sessionStorage.removeItem('accountNickname');
          sessionStorage.removeItem('roleId');
          resolve(res)
        }).catch(err => reject(err))
      })
    },
  }
}
