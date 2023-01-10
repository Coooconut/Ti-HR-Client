import { defineStore } from "pinia";

export default defineStore("process", {
  state: () => ({
    loadingGpsPunch: false,
    loadingUserPosition: false,
    loading2DCode: false,
    loading2DCodePunch: false,
  }),
});
