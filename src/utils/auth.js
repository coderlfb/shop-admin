/**
 * 通过使用vueUse中的cookie方法操作token
 */
import { useCookies } from "@vueuse/integrations/useCookies";
const TOKEN_KEY = "admin-token";

const cookie = useCookies(["cookie"]);

console.log("cookie方法:", cookie);

export default {
  setToken(token) {
    console.log("登录成功设置token=======");
    cookie.set(TOKEN_KEY, token);
  },

  getToken() {
    return cookie.get(TOKEN_KEY);
  },

  removeToken() {
    cookie.remove(TOKEN_KEY);
  },
};
