<template>
  <main>
    <div class="container">
      <GpsApp />
      <GoogleMap />
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
