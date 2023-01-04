<template>
  <!-- Page Navbar -->
  <page-navbar
    :token="token"
    :employee_id="employee_id"
    @emit-get-user-ip="getUserIP"
    @emit-sign-out="signOut"
  ></page-navbar>
  <!-- Main -->
  <main>
    <!-- Header -->
    <header>
      <h4>{{ full_name }}你好。今天也是個美好的一天。</h4>
    </header>
    <div name="dev">
      <h1>{{ message }}</h1>
      <p>App.vue.response: {{ response }}</p>
      <!-- <p>App.vue.ip: {{ user_ip }}</p> -->
      <p>auth.token = {{ this.authStore.token }}</p>
    </div>
    <!-- 登入表單 -->
    <sign-in-form :response="response" @emit-sign-in="signIn"></sign-in-form>
    <!-- 更改密碼表單 -->
    <change-password-form
      :token="token"
      @emit-change-password="changePassword"
    ></change-password-form>
    <!-- 二維碼 -->
    <two-d-code :two_d_code="two_d_code"></two-d-code>
  </main>
  <router-view />
</template>

<script>
import { RouterLink, RouterView } from "vue-router";
import { mapStores } from "pinia";
import useAuthStore from "./stores/auth";
import { createToaster } from "@meforma/vue-toaster";
import ChangePasswordForm from "./components/ChangePasswordForm.vue";
import PageNavbar from "./components/PageNavbar.vue";
import SignInForm from "./components/SignInForm.vue";
import TwoDCode from "./components/TwoDCode.vue";

const toasterInfo = createToaster({
  type: "info",
  position: "top",
  duration: 8000,
});

export default {
  name: "App",
  components: {
    ChangePasswordForm,
    PageNavbar,
    SignInForm,
    TwoDCode,
  },
  computed: {
    // mapStores 需搭配展開運算子，引數代入 store。
    ...mapStores(useAuthStore),
  },
  data() {
    return {
      count: null,
      page_current: 1,
      page_sum: null,
      data: null,
      distance: null,
      employee_id: null,
      full_name: null,
      message: null,
      response: null,
      token: null,
      two_d_code: null,
      user_ip: null,
      user_latlng_1: null,
      user_latlng_2: null,
    };
  },
  methods: {
    changePassword(res) {
      toasterInfo.show(res.message);
      this.response = res;
    },
    getPunches() {
      this.page_current = this.page;
      fetch(
        `${import.meta.env.VITE_BASE_URL}/api/punches?` +
          new URLSearchParams({
            page: this.page_current,
          }),
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then((res) => {
          this.response = res;
          this.message = res.message;
          this.count = res.count;
          this.data = res.data;
          this.page_sum = Math.ceil(this.count / 10);
        });
    },
    getUserIP() {
      fetch("https://api.ipify.org?format=json")
        .then((res) => res.json())
        .then(({ ip }) => {
          this.user_ip = ip;
          this.show2dCode();
        });
    },
    show2dCode() {
      if (!this.two_d_code) {
        fetch(`${import.meta.env.VITE_BASE_URL}/api/employees/2d_code_auth`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
          },
          body: `userIP=${this.user_ip}`,
        })
          .then((res) => {
            return res.json();
          })
          .then((res) => {
            this.two_d_code = res.punchCode;
            toasterInfo.show(res.message);
            this.response = res;
          })
          .catch((err) => {
            console.error(err);
          });
      }
    },
    signIn(res) {
      this.employee_id = res.data.employee.code;
      this.full_name = res.data.employee.fullName;
      toasterInfo.show(res.message);
      this.response = res;
      this.token = res.data.token;
      this.authStore.token = res.data.token;
    },
    signOut() {
      toasterInfo.show("你已登出系統");
    },
  },
};
</script>

<style></style>
