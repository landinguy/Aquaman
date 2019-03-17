import Axios from 'axios'
import baseUrl from "./url"
import {Message, Spin} from 'iview'
import {handleSpinCustom} from './util'

class httpRequest {
  constructor() {
    this.options = {
      method: '',
      url: ''
    }
    // 存储请求队列
    this.queue = {}
  }

  // 销毁请求实例
  destroy(url) {
    delete this.queue[url]
    const queue = Object.keys(this.queue)
    return queue.length
  }


  interceptors(instance, url) {
    // 添加请求拦截器
    instance.interceptors.request.use(config => {
      handleSpinCustom();
      console.log("request:", config)
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 添加拦截器
    instance.interceptors.response.use(res => {
      console.log("response:", res);
      if (res.status == 200 || res.status == 201) {
        if (res.data.code == -1) {
          Message.error(res.data.msg)
        }
        Spin.hide();
        return res.data;
      }
      Spin.hide()
    }, err => {
      Spin.hide();
      console.log(err)

      if (err.toString().search("401") != -1) {
        window.location.href = '/#/login'
        // Message.error('未登录，或登录失效，请登录')
      } else {
        Message.error('网络繁忙，请稍后重试')
      }
      return Promise.reject(err)
    });
  }

  // 创建实例
  create() {
    let conf = {
      baseURL: baseUrl.base,//baseUrl
      timeout: 10000,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken')
      }
    }
    return Axios.create(conf)
  }

  // 合并请求实例
  mergeReqest(instances = []) {
    //
  }

  // 请求实例
  request(options) {
    console.log("options", options);
    let instance = this.create();
    // options.url =  options.url + "?m=" + sessionStorage.getItem("tab")
    this.interceptors(instance, options.url);
    options = Object.assign({}, options);
    this.queue[options.url] = instance;
    return instance(options)
  }
}

const axios = new httpRequest();
export default axios
