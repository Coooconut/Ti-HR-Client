<template>
  <main>
    <div class="container">
      <!-- GPS 打卡頁面中的 Google 地圖 -->
      <GoogleMap />
      <!-- GPS 打卡按鈕及打卡邏輯 -->
      <GpsApp />
    </div>
  </main>
</template>

<script setup>
import GpsApp from "../components/GpsApp.vue";
import GoogleMap from "../components/GoogleMap.vue";
</script>

<style>
.container {
  display: flex;
  justify-content: center;
}
</style>
