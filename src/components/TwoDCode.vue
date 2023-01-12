<template>
  <main class="container d-flex flex-row">
    <div class="code-container mx-5">
      <h3 class="hint">你的打卡二維碼</h3>
      <div class="spinner mt-2" v-if="process.loading2DCode === true">
        <div class="spinner-border text-success mt-2 mx-2" role="status"></div>
        <span>正在取得打卡二維碼，請稍候。</span>
      </div>
      <img :src="auth.twoDCode" alt="打卡二維碼" />
    </div>
    <div class="code-container mx-5">
      <h3 class="hint">Demo 專用打卡二維碼（不審核裝置IP）</h3>
      <div class="spinner mt-2" v-if="process.loading2DCode === true">
        <div class="spinner-border text-success mt-2 mx-2" role="status"></div>
        <span>正在取得打卡二維碼，請稍候。</span>
      </div>
      <img :src="auth.twoDCodeDemo" alt="Demo 專用打卡二維碼（不審核裝置IP）" />
    </div>
  </main>
</template>

<script setup>
import useAuthStore from "../stores/auth";
import useProcessStore from "../stores/process";
const auth = useAuthStore();
const process = useProcessStore();
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
