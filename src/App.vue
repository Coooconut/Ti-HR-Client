<template>
  <!-- Page Navbar -->
  <page-navbar
    @mouseover.prevent="checkAuthExp"
    @emit-get-user-ip="getUserIP"
  ></page-navbar>
  <!-- Main -->
  <main @mouseover.prevent="checkAuthExp">
    <!-- Header -->
    <header v-if="auth.user !== null">
      <h4>{{ auth.user.fullName }}你好。今天也是個美好的一天。</h4>
    </header>
    <!-- 登入表單 -->
    <sign-in-form v-if="auth.user === null"></sign-in-form>
    <!-- WebSocket -->
    <web-socket />
  </main>
  <router-view />
</template>

<script setup>
import { ref } from "vue";
import dayjs from "dayjs";
import useAuthStore from "./stores/auth";
import useProcessStore from "./stores/process";
import WebSocket from "./components/WebSocket.vue";
import PageNavbar from "./components/PageNavbar.vue";
import SignInForm from "./components/SignInForm.vue";

const auth = useAuthStore();
const process = useProcessStore();

let user_ip = ref(null);

// 配合 Navbar 及 main 標籤的 @mouseover.prevent，比對 JWT 效期與當下時間。若 JWT 效期已過，就將使用者登出系統。
function checkAuthExp() {
  if (new Date(dayjs(auth.authExp).format()) < new Date()) {
    auth.signOut("登入權杖過期，請重新登入。");
  }
}
function getUserIP() {
  fetch("https://api.ipify.org?format=json")
    .then((res) => res.json())
    .then(({ ip }) => {
      user_ip.value = ip;
      if (!auth.twoDCode) {
        show2dCode();
      }
    })
    .catch((err) => {
      process.loading2DCode = false;
      console.error(err);
    });
}
function show2dCode() {
  if (!auth.twoDCode) {
    fetch(`${import.meta.env.VITE_BASE_URL}/api/employees/2d_code_auth`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
      },
      body: `userIP=${user_ip.value}`,
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        auth.twoDCode = auth.twoDCode || res.punchCode;
        auth.twoDCodeDemo = auth.twoDCodeDemo || res.punchCodeDemo;
        process.loading2DCode = false;
      })
      .catch((err) => {
        process.loading2DCode = false;
        console.error(err);
      });
  }
}
</script>

<style>
.container {
  display: flex;
  justify-content: center;
}
</style>
