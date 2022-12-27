<template>
  <page-navbar />
  <!-- Header -->
  <header>
    <h4>XXX，你好。今天也是個美好的一天。</h4>
    <h4>你的打卡狀態：未打卡</h4>
  </header>
  <h1>{{ message }}</h1>
  <h6>token: {{ token }}</h6>
  <h6>App.vue.response: {{ response }}</h6>
  <sign-in-form :response="response" @emit-sign-in="signIn"></sign-in-form>
  <change-password-form
    :token="token"
    @emit-change-password="changePassword"
  ></change-password-form>
</template>

<script>
import { RouterLink, RouterView } from "vue-router";
import ChangePasswordForm from "./components/ChangePasswordForm.vue";
import PageNavbar from "./components/PageNavbar.vue";
import SignInForm from "./components/SignInForm.vue";

export default {
  name: "App",
  components: {
    ChangePasswordForm,
    PageNavbar,
    SignInForm,
  },
  data() {
    return {
      hint: "提示訊息",
      message: null,
      response: null,
      token: null,
    };
  },
  methods: {
    changePassword(res) {
      this.message = res.message;
      this.response = res;
    },
    signIn(res) {
      this.message = res.message;
      this.response = res;
      this.token = res.data.token;
    },
  },
};
</script>

<style></style>
