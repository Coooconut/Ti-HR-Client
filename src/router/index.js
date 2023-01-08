import { createRouter, createWebHashHistory } from "vue-router";
import AdminView from "../views/AdminView.vue";
import GpsView from "../views/GpsView.vue";
import PersonalPage from "../views/PersonalPage.vue";
import CodeReader from "../views/CodeReader.vue";
import TwoDCode from "../views/TwoDCode.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/sign-out",
      redirect: "/",
    },
    {
      path: "/",
      name: "home",
    },
    {
      path: "/admin",
      component: AdminView,
      name: "AdminView",
    },
    {
      path: "/personal-page",
      component: PersonalPage,
      name: "PersonalPage",
    },
    {
      path: "/gps",
      component: GpsView,
      name: "GpsView",
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
