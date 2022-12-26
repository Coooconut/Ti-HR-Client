<template>
  <page-navbar />
  <!-- Header -->
  <header>
    <h4>XXX，你好。今天也是個美好的一天。</h4>
    <h4>你的打卡狀態：未打卡</h4>
  </header>
  <!-- 登入表單 -->
  <form>
    <div class="mb-3">
      <label for="employee-code" class="form-label">員工編號</label>
      <input
        type="text"
        name="employee-code"
        class="form-control"
        id="employee-code"
        placeholder="Enter your employee code."
      />
    </div>
    <div class="mb-3">
      <label for="password" class="form-label">密碼</label>
      <input
        type="password"
        name="password"
        class="form-control"
        id="password"
        placeholder="Enter your password."
      />
    </div>
    <span>登入系統</span>
    <button type="submit" class="btn btn-primary">Submit</button>
  </form>
</template>

<script>
import { RouterLink, RouterView } from "vue-router";
import PageNavbar from "./components/PageNavbar.vue";

export default {
  components: {
    PageNavbar,
  },
};
</script>

<style></style>
