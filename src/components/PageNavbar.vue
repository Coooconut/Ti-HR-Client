<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <RouterLink class="navbar-brand" to="/">Ti 專業人資系統</RouterLink>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div
        class="collapse navbar-collapse"
        id="navbarSupportedContent"
        v-if="auth.user !== null"
      >
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <!-- GPS 按鈕打卡 -->
          <li class="nav-item">
            <RouterLink class="nav-link" to="gps">GPS 打卡</RouterLink>
          </li>
          <!-- /admin 人資專區 -->
          <li class="nav-item">
            <RouterLink class="nav-link" to="admin">人資專區</RouterLink>
          </li>
          <!-- 生成二維碼 -->
          <li class="nav-item">
            <RouterLink
              class="nav-link"
              to="2d-code"
              @click.prevent="toggle2dCode"
              >取得打卡二維碼</RouterLink
            >
          </li>
          <!-- /code-reader 掃碼打卡 -->
          <li class="nav-item">
            <RouterLink class="nav-link" to="code-reader">掃碼打卡</RouterLink>
          </li>
          <!-- 個人頁面 -->
          <li class="nav-item">
            <RouterLink class="nav-link" to="personal-page"
              >個人頁面</RouterLink
            >
          </li>
        </ul>
        <form class="d-flex" role="search">
          <RouterLink
            class="btn btn-outline-secondary"
            to="/sign-out"
            @click.prevent="signOut"
            >登出系統</RouterLink
          >
        </form>
      </div>
    </div>
  </nav>
</template>

<script setup>
import useAuthStore from "@/stores/auth";
import useProcessStore from "@/stores/process";
import { RouterLink } from "vue-router";
import { createToaster } from "@meforma/vue-toaster";

const auth = useAuthStore();
const process = useProcessStore();
const emit = defineEmits(["emit-get-user-ip", "emit-sign-out"]);
const toasterInfo = createToaster({
  type: "info",
  position: "top",
  duration: 5000,
});

function toggle2dCode() {
  if (auth.twoDCode === null) {
    process.loading2DCode = true;
    emit("emit-get-user-ip");
  }
}
function signOut() {
  if (auth.token) {
    auth.token = null;
    auth.twoDCode = null;
    auth.twoDCodeDemo = null;
    auth.user = null;
    auth.token = null;
    toasterInfo.show("你已登出系統");
  }
}
</script>
