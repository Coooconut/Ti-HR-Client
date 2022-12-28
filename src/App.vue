<template>
  <!-- Page Navbar -->
  <page-navbar
    :token="token"
    :employee_id="employee_id"
    @emit-post-punch="postPunch"
    @emit-get-2d-code="get2dCode"
  ></page-navbar>
  <!-- Header -->
  <header>
    <h4>XXX，你好。今天也是個美好的一天。</h4>
    <h4>你的打卡狀態：未打卡</h4>
  </header>
  <h1>{{ message }}</h1>
  <h6>token: {{ token }}</h6>
  <h6>App.vue.response: {{ response }}</h6>
  <h6>App.vue.employee_id: {{ employee_id }}</h6>
  <!-- 登入表單 -->
  <sign-in-form :response="response" @emit-sign-in="signIn"></sign-in-form>
  <!-- 更改密碼表單 -->
  <change-password-form
    :token="token"
    @emit-change-password="changePassword"
  ></change-password-form>
  <!-- 二維碼 -->
  <two-d-code
    :token="token"
    :two_d_code="two_d_code"
    @emit-get-2d-code="get2dCode"
  ></two-d-code>
</template>

<script>
import { RouterLink, RouterView } from "vue-router";
import ChangePasswordForm from "./components/ChangePasswordForm.vue";
import PageNavbar from "./components/PageNavbar.vue";
import SignInForm from "./components/SignInForm.vue";
import TwoDCode from "./components/TwoDCode.vue";

export default {
  name: "App",
  components: {
    ChangePasswordForm,
    PageNavbar,
    SignInForm,
    TwoDCode,
  },
  data() {
    return {
      employee_id: null,
      message: null,
      response: null,
      token: null,
      two_d_code: null,
    };
  },
  methods: {
    changePassword(res) {
      this.message = res.message;
      this.response = res;
    },
    get2dCode() {
      if (!this.two_d_code) {
        fetch(
          `http://localhost:8000/api/employees/:${this.employee_id}/2d_code`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          }
        )
          .then((res) => {
            return res.json();
          })
          .then((res) => {
            this.two_d_code = res.punchCode;
          })
          .catch((err) => {
            console.error(err);
          });
      }
    },
    postPunch(res) {
      this.message = res.message;
      this.response = res;
    },
    signIn(res) {
      this.employee_id = res.data.employee.code;
      this.message = res.message;
      this.response = res;
      this.token = res.data.token;
    },
  },
};
</script>

<style></style>
