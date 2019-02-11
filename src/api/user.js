import axios from '@/libs/axios'
import url from './url'

export const login = ({username, password}) => {
  const rest = {
    grant_type: 'password',
    scope: 'all',
    client: 'bytecodes-web-client',
    type: 'teacher',
  };
  const data = {
    username,
    password,
    ...rest
  };
  return axios.request({
    url: url.login,
    data: data,
    method: 'post',
    contentType: 'application/x-www-form-urlencoded'
  })
}

export const logout = () => {
  const data = {}
  return axios.request({
    url: url.logout,
    data: data,
    method: 'post'
  })
}
