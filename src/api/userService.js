import axios from "~/axios.js";

export default {
  /**
   * 新增用户
   */
  addUser(postData) {
    return axios.post("/admin/user", postData);
  },
  /**
   * 删除用户
   */
  deleteUser(id) {
    return axios.post(`/admin/user/${id}/delete`);
  },
  /**
   * 修改用户状态
   */
  changeStatus(id, status) {
    return axios.post(`/admin/user/${id}/update_status`, {
      status: status,
    });
  },
};
