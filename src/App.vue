<template>
  <!-- Page Navbar -->
  <page-navbar
    @emit-get-user-ip="getUserIP"
    @emit-sign-out="signOut"
  ></page-navbar>
  <!-- Main -->
  <main>
    <!-- Header -->
    <header v-if="this.authStore.user !== null">
      <h4>{{ this.authStore.user.fullName }}你好。今天也是個美好的一天。</h4>
    </header>
    <!-- 登入表單 -->
    <sign-in-form
      v-if="this.authStore.user === null"
      @emit-sign-in="signIn"
    ></sign-in-form>
  </main>
  <router-view />
</template>

<script>
import { mapStores } from "pinia";
import useAuthStore from "./stores/auth";
import useProcessStore from "./stores/process";
import { createToaster } from "@meforma/vue-toaster";
import PageNavbar from "./components/PageNavbar.vue";
import SignInForm from "./components/SignInForm.vue";

const toasterInfo = createToaster({
  type: "info",
  position: "top",
  duration: 8000,
});

export default {
  name: "App",
  components: {
    PageNavbar,
    SignInForm,
  },
  computed: {
    // mapStores 需搭配展開運算子，引數代入 store。
    ...mapStores(useAuthStore),
    ...mapStores(useProcessStore),
  },
  data() {
    return {
      user_ip: null,
    };
  },
  methods: {
    getUserIP() {
      fetch("https://api.ipify.org?format=json")
        .then((res) => res.json())
        .then(({ ip }) => {
          this.user_ip = ip;
          if (!this.authStore.twoDCode) {
            this.show2dCode();
          }
        })
        .catch((err) => {
          this.processStore.loading2DCode = false;
          console.error(err);
        });
    },
    show2dCode() {
      if (!this.authStore.twoDCode) {
        fetch(`${import.meta.env.VITE_BASE_URL}/api/employees/2d_code_auth`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${this.authStore.token}`,
            "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
          },
          body: `userIP=${this.user_ip}`,
        })
          .then((res) => {
            return res.json();
          })
          .then((res) => {
            this.two_d_code = res.punchCode;
            this.authStore.twoDCode = this.authStore.twoDCode || res.punchCode;
            this.processStore.loading2DCode = false;
          })
          .catch((err) => {
            this.processStore.loading2DCode = false;
            console.error(err);
          });
      }
    },
    signIn(res) {
      this.authStore.token = res.data.token;
      this.authStore.user = res.data.employee;
    },
    signOut() {
      this.authStore.twoDCode = null;
      this.authStore.user = null;
      this.authStore.token = null;
      toasterInfo.show("你已登出系統");
    },
  },
};
</script>

<style>
.container {
  display: flex;
  justify-content: center;
}
</style>
