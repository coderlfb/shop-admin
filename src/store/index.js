import { createStore } from "vuex";
import managerService from "../api/managerService";

// 创建一个新的 store 实例
const store = createStore({
  state() {
    return {
      // 用户信息
      user: {},
      // 侧边栏宽度
      asideWidth: "250px",
    };
  },
  mutations: {
    // 记录用户信息
    SET_USERINFO(state, user) {
      state.user = user;
    },
    // 展开/缩起侧边栏
    handleSetAsideWidth(state) {
      state.asideWidth = state.asideWidth == "250px" ? "64px" : "250px";
    },
  },
  actions: {
    // 获取当前登录用户信息
    getUserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        managerService
          .getUserInfo()
          .then((res) => {
            commit("SET_USERINFO", res);
            resolve(res);
          })
          .catch((err) => reject(err));
      });
    },
  },
});

export default store;
