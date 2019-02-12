import axios from '@/libs/axios'
import url from './url'
import ax from 'axios'
import baseUrl from "../libs/url"

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
  return ax({
    method: "post",
    url: baseUrl.base + url.login,
    params: data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic Ynl0ZWNvZGVzLXdlYi1jbGllbnQ6ZDNlYjM1ZjktNmJiMC00NTBmLThmMDEtZjMwYWZiN2VlMjhk'
    }
  })
}

export const logout = ({token}) => {
  return ax({
    method: "post",
    url: baseUrl.base + url.logout,
    headers: {
      'Authorization': token
    }
  })
}
