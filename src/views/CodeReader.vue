<template>
  <main>
    <div class="camera-container">
      <CodeReader class="camera"></CodeReader>
    </div>
  </main>
</template>

<script setup>
import CodeReader from "../components/CodeReader.vue";
</script>

<style>
.camera-container {
  display: flex;
  justify-content: center;
}

.camera {
  width: 30vw;
}
</style>
