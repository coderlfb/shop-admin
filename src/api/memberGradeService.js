import axios from "~/axios.js";

export default {
  /**
   * 获取会员等级列表
   * @returns
   */
  getGradeList() {
    return axios.get("/admin/user_level/1");
  },
  /**
   * 获取用户列表
   */
  getUserList(page, keyword = "", user_level_id = "") {
    let opts = "";
    if (keyword !== "") {
      opts = "?keyword=" + keyword;
    }
    if (user_level_id !== "") {
      if (opts !== "") {
        opts = opts + "&user_level_id=" + user_level_id;
      } else {
        opts = "?user_level_id=" + user_level_id;
      }
    }
    return axios.get(`/admin/user/${page}` + opts);
  },
};
