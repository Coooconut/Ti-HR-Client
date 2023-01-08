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
import { RouterLink, RouterView } from "vue-router";
import { mapStores } from "pinia";
import useAuthStore from "./stores/auth";
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
      token: null,
      two_d_code: null,
      user_ip: null,
      user_latlng_1: null,
      user_latlng_2: null,
    };
  },
  methods: {
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
          this.count = res.count;
          this.data = res.data;
          this.page_sum = Math.ceil(this.count / 10);
        });
    },
    getUserIP() {
      fetch("https://api.ipify.org?format=json")
        .then((res) => res.json())
        .then(({ ip }) => {
          console.log(ip);
          this.user_ip = ip;
          if (!this.authStore.twoDCode) {
            this.show2dCode();
          }
        });
    },
    show2dCode() {
      if (!this.two_d_code) {
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
            toasterInfo.show(res.message);
          })
          .catch((err) => {
            console.error(err);
          });
      }
    },
    signIn(res) {
      this.employee_id = res.data.employee.code;
      this.full_name = res.data.employee.fullName;
      this.token = res.data.token;
      this.authStore.token = res.data.token;
      this.authStore.user = res.data.employee;
    },
    signOut() {
      this.token = null;
      this.authStore.twoDCode = null;
      this.authStore.user = null;
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
