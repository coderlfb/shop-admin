import axios from "~/axios.js";

export default {
  /**
   * 用户登录
   */
  login(postData) {
    return axios.post("/admin/login", postData);
  },

  /**
   * 获取登录的用户信息
   * @returns
   */
  getUserInfo() {
    return axios.post("/admin/getinfo");
  },

  /**
   * 退出登录
   */
  logout() {
    return axios.post("/admin/logout");
  },

  /**
   * 修改密码
   */
  changePassword(postData) {
    return axios.post("/admin/updatepassword", postData);
  },

  /**
   * 获取首页统计接口1
   */
  getStatisticalInfo() {
    return axios.get("/admin/statistics1");
  },
};
