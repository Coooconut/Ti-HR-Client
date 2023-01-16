<template>
  <!-- Page Navbar -->
  <page-navbar @emit-get-user-ip="getUserIP"></page-navbar>
  <!-- Main -->
  <main>
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
import useAuthStore from "./stores/auth";
import useProcessStore from "./stores/process";
import WebSocket from "./components/WebSocket.vue";
import PageNavbar from "./components/PageNavbar.vue";
import SignInForm from "./components/SignInForm.vue";

const auth = useAuthStore();
const process = useProcessStore();

let user_ip = ref(null);

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
