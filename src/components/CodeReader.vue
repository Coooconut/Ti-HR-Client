<template>
  <div>
    <p class="error">{{ error }}</p>
    <div class="result-container">
      <p class="decode-result">最近的掃碼結果：{{ result }}</p>
      <div
        class="spinner mt-2"
        v-if="this.processStore.loading2DCodePunch === true"
      >
        <div class="spinner-border text-success mt-2 mx-2" role="status"></div>
        <span>打卡程序處理中，請暫時停止任何操作。</span>
      </div>
    </div>
    <qrcode-stream @decode="onDecode" @init="onInit" />
  </div>
</template>

<script>
import { QrcodeStream } from "vue-qrcode-reader";
import { mapStores } from "pinia";
import useAuthStore from "@/stores/auth";
import useProcessStore from "@/stores/process";
import { createToaster } from "@meforma/vue-toaster";

const toasterInfo = createToaster({
  type: "info",
  position: "top-left",
  duration: 8000,
});

export default {
  components: { QrcodeStream },
  computed: {
    // mapStores 需搭配展開運算子，引數代入 store。
    ...mapStores(useAuthStore),
    ...mapStores(useProcessStore),
  },
  data() {
    return {
      result: null,
      error: null,
    };
  },
  methods: {
    // 掃碼儀解碼
    onDecode(result) {
      this.processStore.loading2DCodePunch = true;
      this.result = result;
      this.tweDCodePunch();
    },
    // 啟用掃碼儀
    async onInit(promise) {
      try {
        await promise;
      } catch (error) {
        this.processStore.loading2DCodePunch = false;
        if (error.name === "NotAllowedError") {
          // 現階段只將兩種常見的錯誤訊息中文化，剩餘的未來有時間再翻譯。
          this.error = "無法掃碼：你必須授權使用攝影鏡頭才可掃描二維碼。";
        } else if (error.name === "NotFoundError") {
          this.error = "無法掃碼：你的裝置沒有攝影鏡頭，無法掃描二維碼。";
        } else if (error.name === "NotSupportedError") {
          this.error = "ERROR: secure context required (HTTPS, localhost)";
        } else if (error.name === "NotReadableError") {
          this.error = "ERROR: is the camera already in use?";
        } else if (error.name === "OverconstrainedError") {
          this.error = "ERROR: installed cameras are not suitable";
        } else if (error.name === "StreamApiNotSupportedError") {
          this.error = "ERROR: Stream API is not supported in this browser";
        } else if (error.name === "InsecureContextError") {
          this.error =
            "ERROR: Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.";
        } else {
          this.error = `ERROR: Camera error (${error.name})`;
        }
      }
    },
    // GET /api/punches/:encrypted_value 以掃描二維碼取得的網址發出打卡請求
    tweDCodePunch() {
      fetch(this.result, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.authStore.token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((res) => {
          this.processStore.loading2DCodePunch = false;
          toasterInfo.show(res.message);
        })
        .catch((err) => {
          this.processStore.loading2DCodePunch = false;
          console.error(err);
        });
    },
  },
};
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
