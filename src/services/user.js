import {LOGIN, ROUTES} from '@/services/api'
import {request, METHOD} from '@/utils/request'
/**
 * 登录服务
 * @param name 账户名
 * @param password 账户密码
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function login(name, password) {
  return request(LOGIN, METHOD.POST, {
    name: name,
    password: password
  })
}

export async function getRoutesConfig() {
  return request(ROUTES, METHOD.GET)
}

export async function getRoles() {
  return request(process.env.VUE_APP_API_BASE_URL_AUTH + '/role/findRoleByCurrentUser', METHOD.GET)
}

export async function getMenus() {
  return request(process.env.VUE_APP_API_BASE_URL_AUTH + '/menu/findMenuByCurrentUser', METHOD.GET)
}

/**
 * 退出登录
 */
export async function logout() {
  return request(process.env.VUE_APP_API_BASE_URL_AUTH + '/logout',METHOD.GET);
}
export default {
  login,
  logout,
  getRoutesConfig
}
