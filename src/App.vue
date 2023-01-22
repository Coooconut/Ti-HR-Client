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
  </main>
  <router-view />
</template>

<script setup>
import { ref } from "vue";
import dayjs from "dayjs";
import useAuthStore from "./stores/auth";
import useProcessStore from "./stores/process";
import PageNavbar from "./components/PageNavbar.vue";
import SignInForm from "./components/SignInForm.vue";

const auth = useAuthStore();
const process = useProcessStore();
// 使用者取得每日專屬打卡二維碼前，需將 IP 存入 user_ip。
let user_ip = ref(null);

// 配合 Navbar 及 main 標籤的 @mouseover.prevent，比對 JWT 效期與當下時間。若 JWT 效期已過，就將使用者登出系統。
function checkAuthExp() {
  if (new Date(dayjs(auth.authExp).format()) < new Date()) {
    auth.signOut("登入權杖過期，請重新登入。");
  }
}
// 取得使用者的 IP，避免在公司指定的地點以外打卡。
function getUserIP() {
  fetch("https://api.ipify.org?format=json")
    .then((res) => res.json())
    .then(({ ip }) => {
      user_ip.value = ip;
      // 使用者尚未取得打卡二維碼時才調用函式 show2dCode 取得二維碼
      if (!auth.twoDCode) {
        show2dCode();
      }
    })
    .catch((err) => {
      process.loading2DCode = false;
      console.error(err);
    });
}
// 取得打卡二維碼
function show2dCode() {
  if (!auth.twoDCode) {
    fetch(`${import.meta.env.VITE_BASE_URL}/api/employees/2d_code_auth`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
      },
      // 傳送使用者 IP，讓後端驗證使用者是否使用公司認可的 IP 產生二維碼。
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
