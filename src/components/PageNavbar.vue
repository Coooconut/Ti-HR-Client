<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <h4 class="navbar-brand" href="#">Ti 專業人資系統</h4>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <!-- 登入系統 -->
          <li class="nav-item">
            <a class="nav-link" href="#" @click.prevent="toggleSignInForm"
              >登入系統</a
            >
          </li>
          <!-- 按鈕打卡 -->
          <li class="nav-item">
            <a class="nav-link" href="#" @click.prevent="postPunch"
              >GPS定位打卡</a
            >
          </li>
          <!-- /gps -->
          <li class="nav-item">
            <RouterLink class="nav-link" to="gps">GPS打卡頁面</RouterLink>
          </li>
          <!-- /admin -->
          <li class="nav-item">
            <RouterLink class="nav-link" to="admin">人資專區</RouterLink>
          </li>
          <!-- 二維碼打卡 -->
          <li class="nav-item">
            <a class="nav-link" href="#" @click.prevent="toggle2dCode"
              >二維碼打卡</a
            >
          </li>
          <!-- 更改密碼 -->
          <li class="nav-item">
            <a
              class="nav-link"
              href="#"
              @click.prevent="toggleChangePasswordForm"
              >更改密碼</a
            >
          </li>
        </ul>
        <form class="d-flex" role="search">
          <input
            class="form-control me-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
          />
          <button class="btn btn-outline-success" type="submit">Search</button>
        </form>
      </div>
    </div>
  </nav>
</template>

<script>
// 利用 mapStores 插件將 store 融入元件
import { mapStores } from "pinia";
import useFormStore from "@/stores/form";
import { RouterLink } from "vue-router";

export default {
  name: "PageNavbar",
  props: ["employee_id", "token"],
  computed: {
    // mapStores 需搭配展開運算子，引數代入 store。
    ...mapStores(useFormStore),
  },
  emits: ["emit-user-position", "emit-get-user-ip"],
  methods: {
    toggle2dCode() {
      this.$emit("emit-get-user-ip");
      // formStore 是 mapStore 創造的屬性，命名原則為 store名稱＋Store。
      this.formStore.isOpen2dCode = !this.formStore.isOpen2dCode;
    },
    toggleChangePasswordForm() {
      // formStore 是 mapStore 創造的屬性，命名原則為 store名稱＋Store。
      this.formStore.isOpenChangePasswordForm =
        !this.formStore.isOpenChangePasswordForm;
    },
    toggleSignInForm() {
      // formStore 是 mapStore 創造的屬性，命名原則為 store名稱＋Store。
      this.formStore.isOpenSignInForm = !this.formStore.isOpenSignInForm;
    },
    postPunch() {
      this.$emit("emit-user-position");
    },
  },
  components: { RouterLink },
};
</script>
