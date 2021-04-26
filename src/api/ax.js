import axios from '@/libs/axios'

export const send = (url, type, data) => {
  return axios.request({
    url: url,
    data: data,
    method: type
  })
}

export const $get = (url, data) => {
  return axios.request({
    url: url,
    params: data,
    method: 'get'
  })
}

export const post = (url, data) => {
  return new Promise((resolve, reject) => {
    send(url, "post", data).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

export const get = (url, data=null) => {
  return new Promise((resolve, reject) => {
    send(url, "get", data).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

export const $del = (url, data) => {
  return new Promise((resolve, reject) => {
    send(url, "delete", data).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

export const put = (url, data) => {
  return new Promise((resolve, reject) => {
    send(url, "put", data).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

export const patch = (url, data) => {
  return new Promise((resolve, reject) => {
    send(url, "patch", data).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}



