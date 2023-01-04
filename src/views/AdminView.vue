<template>
  <main>
    <PunchTable v-if="auth.user.identity === 'admin'"></PunchTable>
  </main>
</template>

<script setup>
import PunchTable from "../components/PunchTable.vue";
import useAuthStore from "../stores/auth";

const auth = useAuthStore();
</script>
