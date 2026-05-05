import type { App } from "vue";
import { createRouter, createWebHashHistory, type RouteRecordRaw } from "vue-router";

export const Layout = () => import("@/layouts/index.vue");

// 静态路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/redirect",
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index.vue"),
      },
    ],
  },

  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: { hidden: true },
  },
  {
    path: "/user",
    component: Layout,
    children: [
      {
        path: "/user",
        component: () => import("@/views/system/user/index.vue"),
        meta: { title: "管理员列表", icon: "system" },
      },
    ],
  },
  {
    path: "/supplier",
    component: Layout,
    children: [
      {
        path: "/supplier",
        component: () => import("@/views/system/supplier/index.vue"),
        meta: { title: "供应商列表", icon: "setting" },
      },
    ],
  },
  {
    path: "/bidding",
    component: Layout,
    redirect: "/index",
    meta: { title: "招标管理", icon: "client" },
    children: [
      {
        path: "/index",
        component: () => import("@/views/system/bidding/index.vue"),
        meta: { title: "招标商品列表" },
      },
      {
        path: "/log",
        component: () => import("@/views/system/bidding/log.vue"),
        meta: { title: "招标记录" },
      },
    ],
  },
  {
    path: "/",
    name: "/",
    component: Layout,
    redirect: "/profile",
    children: [
      {
        path: "profile",
        name: "Profile",
        component: () => import("@/views/profile/index.vue"),
        meta: { title: "个人中心", hidden: true, affix: true },
      },
      // {
      //   path: "dashboard",
      //   component: () => import("@/views/dashboard/index.vue"),
      //   // 用于 keep-alive 功能，需要与 SFC 中自动推导或显式声明的组件名称一致
      //   // 参考文档: https://cn.vuejs.org/guide/built-ins/keep-alive.html#include-exclude
      //   name: "Dashboard",
      //   meta: {
      //     title: "dashboard",
      //     icon: "homepage",
      //     affix: true,
      //     keepAlive: true,
      //   },
      // },
      {
        path: "401",
        component: () => import("@/views/error/401.vue"),
        meta: { hidden: true },
      },
      {
        path: "404",
        component: () => import("@/views/error/404.vue"),
        meta: { hidden: true },
      },
      // {
      //   path: "profile",
      //   name: "Profile",
      //   component: () => import("@/views/profile/index.vue"),
      //   meta: { title: "个人中心", icon: "user", hidden: true },
      // },
      {
        path: "my-notice",
        name: "MyNotice",
        component: () => import("@/views/profile/notice/index.vue"),
        meta: { title: "我的通知", icon: "user", hidden: true },
      },
      {
        path: "/detail/:id(\\d+)",
        name: "DemoDetail",
        component: () => import("@/views/demo/detail.vue"),
        meta: { title: "详情页缓存", icon: "user", hidden: true, keepAlive: true },
      },
    ],
  },
];

/**
 * 创建路由
 */
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

// 全局注册 router
export function setupRouter(app: App<Element>) {
  app.use(router);
}

export default router;
