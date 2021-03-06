import {login, logout} from '@/api/user'
import {Message, Spin} from 'iview'

export default {
  state: {
    accountId: '',
    accountNumber: '',
    accountNickname: '',
    roleId: '',
    access: "",
    accessToken: '',
    superMsg: 0,
    simpleMsg: 0,
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
      state.access = roleId.split(',');
    },
    setAccessToken(state, accessToken) {
      state.accessToken = accessToken;
      sessionStorage.setItem("accessToken", accessToken);
    },
    setSuperMsg(state, superMsg) {
      state.superMsg = superMsg;
      sessionStorage.setItem("superMsg", superMsg);
    },

    setSimpleMsg(state, simpleMsg) {
      state.simpleMsg = simpleMsg;
      sessionStorage.setItem("simpleMsg", simpleMsg);
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
      state.access = sessionStorage.getItem("roleId").split(',');
      return sessionStorage.getItem("roleId")
    },
    accountNickname: state => {
      state.accountNickname = state.accountNickname;
      return sessionStorage.getItem("accountNickname")
    },
    superMsg: state => {
      state.superMsg = state.superMsg;
      return sessionStorage.getItem("superMsg")
    },
    simpleMsg: state => {
      state.simpleMsg = state.simpleMsg;
      return sessionStorage.getItem("simpleMsg")
    },
    accessToken: state => {
      state.accessToken = state.accessToken;
      return sessionStorage.getItem("accessToken")
    }
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
          const {user_id, nickname, role, access_token} = res.data;
          if (role.indexOf('STUDENT') != -1) {
            Message.error('学生账号不能登录');
            Spin.hide();
            return
          }
          commit('setAccountId', user_id);
          // commit('setAccountNumber', res.data.accountNumber);
          commit('setAccountNickname', nickname);
          commit('setRoleId', role);
          commit('setAccessToken', access_token);
          // commit('setSuperMsg', res.data.superMsg);
          // commit('setSimpleMsg', res.data.simpleMsg);
          resolve(res)
        }).catch(err => {
          Message.error('用户名或密码错误');
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut({state, commit}, {token}) {
      return new Promise((resolve, reject) => {
        logout({token}).then(res => {
          sessionStorage.removeItem('accountId');
          sessionStorage.removeItem('accountNickname');
          sessionStorage.removeItem('roleId');
          sessionStorage.removeItem('accessToken');
          resolve(res)
        }).catch(err => reject(err))
      })
    },
  }
}
