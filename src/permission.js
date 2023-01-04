import { router, addRoutes } from "./router";
import auth from "~/utils/auth.js";
import noticefy from "~/utils/noticefy";
import store from "./store";
import utils from "~/utils/util";

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  utils.showFullLoading();
  const token = auth.getToken();

  // 没有登录就强制跳到登录页
  if (!token && to.path != "/login") {
    noticefy.noticefyMessage("error", "请先登录");
    return next({ path: "/login" });
  }

  // 防止重复登录
  if (token && to.path === "/login") {
    noticefy.noticefyMessage("error", "请勿重复登录");
    return next({
      path: from.path ? from.path : "/",
    });
  }

  // 如果用户已经登录过，则自动获取用户信息
  let hasNewRoutes = false;
  if (token) {
    let { menus } = await store.dispatch("getUserInfo");
    // 动态添加路由
    hasNewRoutes = addRoutes(menus);
  }

  // 设置页面标题
  let title = (to.meta.title ? to.meta.title : "") + "-商城管理后台";
  document.title = title;

  // 有新路由就指定路由
  hasNewRoutes ? next(to.fullPath) : next();
});

// 全局后置钩子
router.afterEach((to, from) => {
  utils.hideFullLoading();
});
