<template>
  <div>
    <p class="error">{{ error }}</p>
    <div class="result-container">
      <p class="decode-result">最近的掃碼結果：{{ result }}</p>
      <div class="spinner mt-2" v-if="process.loading2DCodePunch === true">
        <div class="spinner-border text-success mt-2 mx-2" role="status"></div>
        <span>打卡程序處理中，請暫時停止任何操作。</span>
      </div>
    </div>
    <qrcode-stream @decode="onDecode" @init="onInit" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { QrcodeStream } from "vue-qrcode-reader";
import useAuthStore from "@/stores/auth";
import useProcessStore from "@/stores/process";
import { createToaster } from "@meforma/vue-toaster";

const auth = useAuthStore();
const process = useProcessStore();

const toasterInfo = createToaster({
  type: "info",
  position: "top-left",
  duration: 8000,
});
let result = ref(null);
let error = ref(null);

// 掃碼儀解碼
function onDecode(scanResult) {
  process.loading2DCodePunch = true;
  result.value = scanResult;
  twoDCodePunch();
}
// 啟用掃碼儀
async function onInit(promise) {
  try {
    await promise;
  } catch (err) {
    process.loading2DCodePunch = false;
    if (err.name === "NotAllowedError") {
      // 現階段只將兩種常見的錯誤訊息中文化，剩餘的未來有時間再翻譯。
      error.value = "無法掃碼：你必須授權使用攝影鏡頭才可掃描二維碼。";
    } else if (err.name === "NotFoundError") {
      error.value = "無法掃碼：你的裝置沒有攝影鏡頭，無法掃描二維碼。";
    } else if (err.name === "NotSupportedError") {
      error.value = "ERROR: secure context required (HTTPS, localhost)";
    } else if (err.name === "NotReadableError") {
      error.value = "ERROR: is the camera already in use?";
    } else if (err.name === "OverconstrainedError") {
      error.value = "ERROR: installed cameras are not suitable";
    } else if (err.name === "StreamApiNotSupportedError") {
      error.value = "ERROR: Stream API is not supported in this browser";
    } else if (err.name === "InsecureContextError") {
      error.value =
        "ERROR: Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.";
    } else {
      error.value = `ERROR: Camera error (${err.name})`;
    }
  }
}
// GET /api/punches/:encrypted_value 以掃描二維碼取得的網址發出打卡請求
function twoDCodePunch() {
  fetch(result.value, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${auth.token}`,
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      process.loading2DCodePunch = false;
      toasterInfo.show(res.message);
    })
    .catch((err) => {
      process.loading2DCodePunch = false;
      console.error(err);
    });
}
</script>

<style scoped>
.error {
  font-weight: bold;
  color: red;
}

.result-container {
  width: 80vh;
}

.decode-result {
  word-wrap: break-word;
}
</style>
