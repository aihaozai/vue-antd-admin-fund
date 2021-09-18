import Cookie from 'js-cookie'
import {errorInfo} from '@/utils/notificationUtil'
import {setAuthorization, removeAuthorization, AUTH_TYPE} from '@/utils/request'
import axios from 'axios'

// 401拦截
const resp401 = {
  /**
   * 响应数据之前做点什么
   * @param response 响应对象
   * @param options 应用配置 包含: {router, i18n, store, message}
   * @returns {*}
   */
  onFulfilled(response, options) {
    const {message} = options
    if (response.code === 401) {
      message.error('无此权限')
    }
    return response
  },
  /**
   * 响应出错时执行
   * @param error 错误对象
   * @param options 应用配置 包含: {router, i18n, store, message}
   * @returns {Promise<never>}
   */
  onRejected(error, options) {
    const {message} = options
    const {response} = error
    if (response.status === 401) {
     if(response.data.data['error_description']){
       message.error(response.data.data['error_description'])
     }else{
       message.error('无此权限')
     }
    }
    return Promise.reject(error)
  }
}

const resp403 = {
  onFulfilled(response, options) {
    const {message} = options
    if (response.code === 403) {
      message.error('请求被拒绝')
    }
    return response
  },
  onRejected(error, options) {
    const {message} = options
    const {response} = error
    if (response.status === 403) {
      message.error('请求被拒绝')
    }
    return Promise.reject(error)
  }
}

const resp500 = {
  onRejected(error) {
    const {response} = error
    if (response.status === 500) {
      errorInfo(response.data.error||response.data.message||'服务器出错',response.data.data)
    }
    return Promise.reject(error)
  }
}

const resp503 = {
  onRejected(error) {
    const {response} = error
    if (response.status === 503) {
      errorInfo('连接服务器失败',response.data.error)
    }
    return Promise.reject(error)
  }
}

const reqCommon = {
  /**
   * 发送请求之前做些什么
   * @param config axios config
   * @param options 应用配置 包含: {router, i18n, store, message}
   * @returns {*}
   */ async onFulfilled(config, options) {
    const {message} = options
    const {url, xsrfCookieName} = config
    const obj = Cookie.get('AuthorizationTime');
    if (obj) {
      console.log(Cookie.get('xsrfRefreshToken'))
      console.log(obj)
      console.log((new Date(obj['AuthorizationTime']).getTime() - new Date().getTime()) / 1000, obj['xsrfRefreshToken'])
    }
    if (url.indexOf('/oauth/token') === -1 && xsrfCookieName && !Cookie.get(xsrfCookieName)) {
      message.warning('认证 token 已过期，请重新登录');
      this.$router.push('/login');
    }
    if (url.indexOf('/oauth/token') === -1 && obj && ((new Date(obj).getTime() - new Date().getTime()) / 1000) <= (3 * 60)) {
      removeAuthorization()
      await axios({
        method: 'POST',
        url: process.env.VUE_APP_API_BASE_URL_AUTH + '/oauth/token?grant_type=refresh_token&refresh_token=' + Cookie.get('xsrfRefreshToken'),
        auth: {'username': 'auth_simple', 'password': 'haozai'}
      }).then(res => {
        if (res.status >= 0) {
          const resData = res.data.data;
          setAuthorization({
            token: resData['access_token'],
            expireAt: new Date(resData.expireAt),
            refreshToken: resData['refresh_token']
          }, AUTH_TYPE.BEARER);
        }
      })
    }
    return config
  },
  /**
   * 请求出错时做点什么
   * @param error 错误对象
   * @param options 应用配置 包含: {router, i18n, store, message}
   * @returns {Promise<never>}
   */
  onRejected(error, options) {
    const {message} = options
    message.error(error.message)
    return Promise.reject(error)
  }
}

export default {
  request: [reqCommon], // 请求拦截
  response: [resp401, resp403, resp500, resp503] // 响应拦截
}
