<template>
  <main class="container">
    <h3 class="hint">你的打卡二維碼</h3>
    <img
      :src="auth.twoDCode"
      alt="先登入系統才可取得二維碼。若已經登入，請耐心等待二維碼生成，或者再次點擊「取得打卡二維碼」。"
    />
  </main>
</template>

<script setup>
import useAuthStore from "../stores/auth";
const auth = useAuthStore();
</script>

<style>
.container {
  flex-direction: column;
  align-items: center;
}

.hint {
  color: seagreen;
}

img {
  width: 50vh;
}
</style>
