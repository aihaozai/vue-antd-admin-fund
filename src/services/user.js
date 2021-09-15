import {LOGIN, ROUTES, CURRENT_MENU, CURRENT_ROLE} from '@/services/api'
import {request, METHOD, removeAuthorization} from '@/utils/request'
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
  return request(CURRENT_ROLE, METHOD.GET)
}

export async function getMenus() {
  return request(CURRENT_MENU, METHOD.GET)
}

/**
 * 退出登录
 */
export async function logout() {
  return request(process.env.VUE_APP_API_BASE_URL_AUTH + '/logout',METHOD.GET);
}

export function removeSession() {
  localStorage.removeItem(process.env.VUE_APP_ROUTES_KEY)
  localStorage.removeItem(process.env.VUE_APP_PERMISSIONS_KEY)
  localStorage.removeItem(process.env.VUE_APP_ROLES_KEY)
  removeAuthorization();
}
export default {
  login,
  logout,
  getRoutesConfig,
  getRoles,
  getMenus,
  removeSession,
}
