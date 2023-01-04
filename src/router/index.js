import { createRouter, createWebHashHistory } from "vue-router";

import Login from "~/pages/login.vue";
import Home from "~/pages/home.vue";
import NotFound from "~/pages/404.vue";
import Admin from "~/layouts/admin.vue";
import GoodsList from "~/pages/goods/goodsList.vue";
import CategoryList from "~/pages/goods/categoryList.vue";
import SkuList from "~/pages/goods/skuList.vue";
import UserList from "~/pages/user/userList.vue";

// 默认路由，所有页面共享
const routes = [
  {
    path: "/",
    name: "admin",
    component: Admin,
  },
  {
    path: "/login",
    component: Login,
    meta: {
      title: "登录",
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
    meta: {
      title: "404",
    },
  },
];

const asyncRoutes = [
  {
    path: "/",
    name: "/",
    component: Home,
    meta: {
      title: "后台首页",
    },
  },
  {
    path: "/goods/list",
    name: "/goods/list",
    component: GoodsList,
    meta: {
      title: "商品管理",
    },
  },
  {
    path: "/category/list",
    name: "/category/list",
    component: CategoryList,
    meta: {
      title: "分类列表",
    },
  },
  {
    path: "/skus/list",
    name: "/skus/list",
    component: SkuList,
    meta: {
      title: "规格管理",
    },
  },
  {
    path: "/user/list",
    name: "/user/list",
    component: UserList,
    meta: {
      title: "用户管理",
    },
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// 动态添加路由方法
export function addRoutes(menus) {
  // 是否有新路由
  let hasNewRoutes = false;
  const findAndAddRoutesByMenus = (arr) => {
    arr.forEach((e) => {
      let item = asyncRoutes.find((o) => o.path == e.frontpath);
      if (item && !router.hasRoute(item.path)) {
        router.addRoute("admin", item);
        hasNewRoutes = true;
      }
      // 判断是否存在子菜单
      if (e.child && e.child.length > 0) {
        findAndAddRoutesByMenus(e.child);
      }
    });
  };
  findAndAddRoutesByMenus(menus);

  return hasNewRoutes;
}
