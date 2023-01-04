import { useStore } from "vuex";

const store = useStore();

export default {
  // 设置用户信息
  setUserInfo(user) {
    console.log("vuex示例===", store);
    return store.commit("SET_USERINFO", user);
  },
};
