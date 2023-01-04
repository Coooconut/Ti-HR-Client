import { createRouter, createWebHistory } from "vue-router";
import AdminView from "../views/AdminView.vue";
import GpsView from "../views/GpsView.vue";
import CodeReader from "../views/CodeReader.vue";
import TwoDCode from "../views/TwoDCode.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
    },
    {
      path: "/admin",
      component: AdminView,
      name: "admin",
    },
    {
      path: "/gps",
      component: GpsView,
      name: "gps",
    },
    {
      path: "/code-reader",
      component: CodeReader,
      name: "CodeReader",
    },
    {
      path: "/2d-code",
      component: TwoDCode,
      name: "TwoDCode",
    },
  ],
});

export default router;
