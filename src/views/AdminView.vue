<template>
  <main>
    <AdminApp v-if="auth.user.identity === 'admin'"></AdminApp>
  </main>
</template>

<script setup>
import AdminApp from "../components/AdminApp.vue";
import useAuthStore from "../stores/auth";

const auth = useAuthStore();
</script>
