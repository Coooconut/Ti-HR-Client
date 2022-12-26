<script setup>
import { RouterLink, RouterView } from "vue-router";
import HelloWorld from "./components/HelloWorld.vue";
</script>

<template>
  <!-- Navbar -->
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
            <a class="nav-link" href="#">Link</a>
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

<style></style>
