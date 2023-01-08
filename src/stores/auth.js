import { defineStore } from "pinia";

export default defineStore("auth", {
  state: () => ({
    user: null,
    token: null,
    twoDCode: null,
  }),
  persist: true,
});
