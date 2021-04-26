import {login, logout} from '@/api/user'
import {Message} from 'iview'

export default {
  state: {
    accountId: '',
    accountNumber: '',
    username: '',
    role: '',
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
    setUsername(state, username) {
      state.username = username;
      sessionStorage.setItem("username", username);
    },
    setRole(state, role) {
      state.role = role;
      sessionStorage.setItem("role", role);
      state.access = role;
    },
    setPhone(state, phone) {
      state.phone = phone;
      sessionStorage.setItem("phone", phone)
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
    role: state => {
      state.role = state.role;
      state.access = sessionStorage.getItem("role");
      return sessionStorage.getItem("role")
    },
    username: state => {
      state.username = state.username;
      return sessionStorage.getItem("username")
    },
    accessToken: state => {
      state.accessToken = state.accessToken;
      return sessionStorage.getItem("accessToken")
    },
    phone: state => {
      state.phone = state.phone
      return sessionStorage.getItem("phone")
    },
    email: state => state.email
  },

  actions: {
    updateNickName({commit}, {username}) {
      commit('setUsername', username);
    },
    // 登录
    handleLogin({commit}, {username, password}) {
      return new Promise((resolve, reject) => {
        login({username, password}).then(res => {
          let data = res.data;
          if (data && data.code === 0) {
            const {uid, username, role, phone} = data.data;
            commit('setAccountId', uid);
            commit('setUsername', username);
            commit('setRole', role);
            commit('setPhone', phone);
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
          sessionStorage.removeItem('username');
          sessionStorage.removeItem('role');
          sessionStorage.removeItem('phone');
          resolve(res)
        }).catch(err => reject(err))
      })
    },
  }
}
