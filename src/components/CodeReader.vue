<template>
  <div>
    <p class="error">{{ error }}</p>

    <p class="decode-result">
      Last result: <b>{{ result }}</b>
    </p>

    <p>Code Reader token: {{ token }}</p>

    <qrcode-stream @decode="onDecode" @init="onInit" />
  </div>
</template>

<script>
import { QrcodeStream } from "vue-qrcode-reader";
import useAuthStore from "@/stores/auth";

export default {
  components: { QrcodeStream },

  data() {
    return {
      result: null,
      error: null,
      token: null,
    };
  },
  methods: {
    onDecode(result) {
      const auth = useAuthStore();
      this.token = auth.token;
      this.result = result;
      this.tweDCodePunch();
    },
    async onInit(promise) {
      try {
        await promise;
      } catch (error) {
        if (error.name === "NotAllowedError") {
          this.error = "掃碼失敗：你必須授權使用攝影鏡頭才可掃描二維碼。";
        } else if (error.name === "NotFoundError") {
          this.error = "掃碼失敗：你的裝置沒有攝影鏡頭，無法掃描二維碼。";
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
    // GET /api/punches/:encrypted_value
    tweDCodePunch() {
      console.log("tweDCodePunch 已經調用");
      fetch(this.result, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((res) => {
          console.log("打卡請求已送出");
          console.log(res);
        })
        .catch((err) => console.error(err));
    },
  },
};
</script>

<style scoped>
.error {
  font-weight: bold;
  color: red;
}
</style>
