import axios from "axios";
import auth from "~/utils/auth.js";
import { ElLoading } from "element-plus";
import store from "./store";
import router from "./router";

const request = axios.create({
  baseURL: "/api",
});

var loading;
var hide_loading = true;

/** 下一次请求不显示Loading */
request.hideLoadingOnce = function () {
  hide_loading = true;
};

/**
 * 是否隐藏Loading
 *
 * @returns
 */
function isHideLoading() {
  var b = hide_loading;
  hide_loading = false;
  return b;
}

/**
 * 设置拦截器: 请求拦截器
 */
request.interceptors.request.use(
  (config) => {
    console.log("是否隐藏loading====", isHideLoading());
    if (!isHideLoading()) {
      loading = ElLoading.service({
        lock: true,
        text: "Loading",
      });
    }
    const token = auth.getToken();
    if (token) {
      config.headers["token"] = token; // 让每个请求携带自定义token
    }
    let url = config.url;
    // get参数编码
    if (config.method === "get" && config.params) {
      url += "?";
      const keys = Object.keys(config.params);
      for (const key of keys) {
        if (config.params[key] != null) {
          url += `${key}=${encodeURIComponent(config.params[key])}&`;
        }
      }
      url = url.substring(0, url.length - 1);
      config.params = {};
    }
    config.url = url;
    return config;
  },
  (error) => {
    loading && loading.close();
    // Do something with request error
    console.log(error); // for debug
    Promise.reject(error);
  }
);

// 设置拦截器：响应拦截器
request.interceptors.response.use(
  (response) => {
    loading && loading.close();
    const res = response.data;
    if (res && res.msg === "ok") {
      // 只有code===0才认为是正常返回
      return res.data;
    }
  },

  (error) => {
    loading && loading.close();
    if (error.response && error.response.data) {
      try {
        var data = error.response.data;
        if (
          error.response.config.url.indexOf("/admin/login") >= 0 &&
          (error.response.status === 400 ||
            error.response.status === 403 ||
            error.response.status === 500)
        ) {
          data = {
            code: -1,
            message: "用户名或密码不正确",
          };
        } else {
          if (typeof data === "string") {
            if (error.response.status === 503) {
              data = {
                code: -1,
                message: "当前服务繁忙，请稍后再试！",
              };
            } else {
              data = JSON.parse(error.response.data);
              data = {
                ...data,
                message: data.msg,
              };
              if (data.msg === "非法token，请先登录！") {
                // 清除token
                auth.removeToken();
                // 清除当前用户状态（vuex中的用户信息）
                store.commit("SET_USERINFO", {});
                router.push("/login");
              }
            }
          } else {
            if (data.msg === "非法token，请先登录！") {
              // 清除token
              auth.removeToken();
              // 清除当前用户状态（vuex中的用户信息）
              store.commit("SET_USERINFO", {});
              router.push("/login");
            }
            data = {
              ...data,
              message: data.msg,
            };
          }
        }
        return Promise.reject(data);
      } catch (e) {
        return Promise.reject({
          code: -1,
          message: "网络异常: " + error.response.data,
        });
      }
    } else {
      return Promise.reject({
        code: -1,
        message: error,
      });
    }
  }
);

export default request;
