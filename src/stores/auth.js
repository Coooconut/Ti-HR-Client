import { defineStore } from "pinia";
import { createToaster } from "@meforma/vue-toaster";

const toasterInfo = createToaster({
  type: "info",
  position: "top",
  duration: 5000,
});

export default defineStore("auth", {
  state: () => ({
    authExp: null,
    user: null,
    token: null,
    twoDCode: null,
    twoDCodeDemo: null,
  }),
  actions: {
    signIn(res) {
      toasterInfo.show(res.message);
      this.token = res.data.token;
      this.user = res.data.employee;
      this.authExp = res.data.authExp;
    },
    signOut(message) {
      if (this.token) {
        this.token = null;
        this.twoDCode = null;
        this.twoDCodeDemo = null;
        this.user = null;
        this.token = null;
        this.authExp = null;
        toasterInfo.show(message);
      }
    },
  },
  persist: true,
});
