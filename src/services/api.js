//跨域代理前缀
 const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : process.env.VUE_APP_API_BASE_URL
// const BASE_URL = process.env.VUE_APP_API_BASE_URL
module.exports = {
    LOGIN: `${BASE_URL}/login`,
    ROUTES: `${BASE_URL}/routes`,
    GOODS: `${BASE_URL}/goods`,
    GOODS_COLUMNS: `${BASE_URL}/columns`,
    CURRENT_MENU: `${BASE_URL}/auth/menu/findMenuByCurrentUser`,
    CURRENT_ROLE: `${BASE_URL}/auth/role/findRoleByCurrentUser`,
}
