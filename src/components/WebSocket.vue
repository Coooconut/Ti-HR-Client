<template>
  <h1>{{ unreadCount }}</h1>
  <button class="btn btn-primary" @click.prevent="handleSendMessage">
    發送預設訊息
  </button>
</template>

<script setup>
import { inject, ref } from "vue";

const socket = inject("socket");
let unreadCount = ref(0);

socket.on("connect", () => {
  console.log(`#connect: ${socket.id}`);
  unreadCount.value++;
});

function handleSendMessage() {
  socket.emit("message", "{ text:  '預設訊息'}");
  console.log("預設訊息已送出");
}
</script>
