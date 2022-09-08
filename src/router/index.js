import { createRouter, createWebHashHistory } from "vue-router";

import Login from "~/pages/login.vue";
import Home from "~/pages/home.vue";
import NotFound from "~/pages/404.vue";
import Admin from "~/layouts/admin.vue";
import GoodsList from "~/pages/goods/goodsList.vue";

const routes = [
  {
    path: "/",
    component: Admin,
    // 子路由
    children: [
      {
        path: "/",
        component: Home,
        meta: {
          title: "首页",
        },
      },
      {
        path: "/goods/list",
        component: GoodsList,
        meta: {
          title: "商品管理",
        },
      },
    ],
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
  {
    path: "/admin",
    component: Admin,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
