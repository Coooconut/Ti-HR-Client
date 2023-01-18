<template></template>

<script setup>
import { inject, ref } from "vue";

const socket = inject("socket");
let unreadCount = ref(0);

// WebSocket 的功能目前尚未設計完畢，因此將下列代碼暫時設為註解。
// socket.on("connect", () => {
//   console.log(`#connect: ${socket.id}`);
//   unreadCount.value++;
// });

// function handleSendMessage() {
//   socket.emit("message", "{ text:  '預設訊息'}");
//   console.log("預設訊息已送出");
// }
</script>
