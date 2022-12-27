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
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="#">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#" @click.prevent="toggleSignInForm"
              >登入系統</a
            >
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#" @click.prevent="postPunch">按鈕打卡</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">二維條碼打卡</a>
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

export default {
  name: "PageNavbar",
  computed: {
    // mapStores 需搭配展開運算子，引數代入 store。
    ...mapStores(useFormStore),
  },
  methods: {
    toggleSignInForm() {
      // formStore 是 mapStore 創造的屬性，命名原則為 store名稱＋Store。
      this.formStore.isOpen = !this.formStore.isOpen;
    },
    postPunch() {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29kZSI6IlQwMjIwMDAxIiwiaWRlbnRpdHkiOiJhZG1pbiIsImZ1bGxOYW1lIjoi546L5bCP5piOIiwidHlwb0NvdW50IjowLCJpYXQiOjE2NzIwMjI5NzAsImV4cCI6MTY3MjEwNTc3MH0.BH5tc_bOY6KUIiUzjfmv-v8TBh_UFs71Vstx0RLlALE";
      fetch("http://localhost:8000/api/punches", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((user) => {
          this.user = user;
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
};
</script>
