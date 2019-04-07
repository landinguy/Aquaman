import axios from '@/libs/axios'
import url from './url'
import ax from 'axios'
import baseUrl from "../libs/url"

export const login = ({username, password}) => {
  const data = {username, password};
  return ax({
    method: "get",
    url: baseUrl.base + url.login,
    params: data
  })
}

export const logout = () => {
  return ax({
    method: "get",
    url: baseUrl.base + url.logout
  })
}

export const uploadFile = ({data}) => {
  return ax({
    method: "post",
    url: baseUrl.base + url.upload,
    data,
    headers: {'Content-Type': 'multipart/form-data'}
  })
}
