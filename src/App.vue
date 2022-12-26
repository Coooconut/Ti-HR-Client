<template>
  <page-navbar />
  <!-- Header -->
  <header>
    <h4>XXX，你好。今天也是個美好的一天。</h4>
    <h4>你的打卡狀態：未打卡</h4>
  </header>
  <sign-in-form />
</template>

<script>
import { RouterLink, RouterView } from "vue-router";
import PageNavbar from "./components/PageNavbar.vue";
import SignInForm from "./components/SignInForm.vue";

export default {
  name: "App",
  components: {
    PageNavbar,
    SignInForm,
  },
};
</script>

<style></style>
