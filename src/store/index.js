import { createStore } from "vuex";
import managerService from "../api/managerService";
import { useRoute } from "vue-router";

// 创建一个新的 store 实例
const store = createStore({
  state() {
    return {
      // 用户信息
      user: {},
      // 侧边栏宽度
      asideWidth: "250px",
      menus: [],
      ruleNames: [],
      defaultActive: "/",
      zIndex: 10,
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
    // 记录菜单
    SET_MENUS(state, menus) {
      state.menus = menus;
    },
    // 记录权限
    SET_RULENAMES(state, ruleNames) {
      state.ruleNames = ruleNames;
    },
    // 初始化菜单选中
    initMenusActive(state, path) {
      state.defaultActive = path;
    },
    // 更改顶部标签栏显示层级
    changeZIndex(state, level) {
      state.zIndex = level;
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
            commit("SET_MENUS", res.menus);
            commit("SET_RULENAMES", res.ruleNames);
            resolve(res);
          })
          .catch((err) => reject(err));
      });
    },
  },
});

export default store;
