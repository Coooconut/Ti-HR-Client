<template>
  <main>
    <!-- 使用者的身份是 admin 的時候才顯示元件內容。 -->
    <AdminApp v-if="auth.user.identity === 'admin'"></AdminApp>
  </main>
</template>

<script setup>
import AdminApp from "../components/AdminApp.vue";
import useAuthStore from "../stores/auth";

const auth = useAuthStore();
</script>
