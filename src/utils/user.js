import { useStore } from "vuex";

const store = useStore();

export default {
  setUserInfo(user) {
    console.log("vuex示例===", store);
    return store.commit("SET_USERINFO", user);
  },
};
