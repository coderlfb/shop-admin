/**
 * 页面通知弹窗
 */

import { ElNotification, ElMessageBox } from "element-plus";

export default {
  noticefyMessage(type, message) {
    ElNotification({
      type: type,
      message: message,
      duration: 3000,
    });
  },

  showModal(type = "warning", content = "提示内容", title) {
    return ElMessageBox.confirm(content, title, {
      type,
      confirmButtonText: "确认",
      cancelButtonText: "取消",
    });
  },
};
