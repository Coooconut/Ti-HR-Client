<template></template>

<script setup>
import { inject } from "vue";

const socket = inject("socket");

socket.on("connect", () => {
  console.log(`#connect: ${socket.id}`);
});
</script>
