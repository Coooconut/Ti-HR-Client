<template>
  <div class="gps-app">
    <button
      class="btn btn-success mt-3"
      @click.prevent="userPosition(distanceCalculator)"
    >
      打卡
    </button>
  </div>
  <div class="spinner mt-2" v-if="process.loadingGpsPunch === true">
    <div class="spinner-border text-success mt-2 mx-2" role="status"></div>
    <span
      >打卡程序處理中，請暫時停止任何操作。如果等候時間過久，可能是你未授權本網站定位，
      請檢查瀏覽器設定。</span
    >
  </div>
</template>

<script setup>
import { createToaster } from "@meforma/vue-toaster";
import useAuthStore from "../stores/auth";
import useProcessStore from "../stores/process";
const auth = useAuthStore();
const process = useProcessStore();
const toasterError = createToaster({
  type: "error",
  position: "top",
  duration: 8000,
});
const toasterInfo = createToaster({
  type: "info",
  position: "top",
  duration: 8000,
});

// 偵測使用者所在位置，回呼函式代入計算所在位置與公司距離的函式 distanceCalculator()
function userPosition(cb) {
  if ("geolocation" in navigator) {
    process.loadingGpsPunch = true;
  } else {
    alert("你的裝置或瀏覽器不支援GPS定位");
    return (process.loadingGpsPunch = false);
  }
  if (!auth.token) {
    toasterError.show("你尚未登入，登入後才能打卡。");
  } else if (auth.token) {
    const promise = new Promise(function (resolve) {
      // 使用瀏覽器的定位功能
      navigator.geolocation.getCurrentPosition(function (position) {
        const latlng1 = position.coords.latitude;
        const latlng2 = position.coords.longitude;
        resolve([latlng1, latlng2]);
      });
    });
    promise
      .then((res) => {
        // 將使者所在地的緯度、經度傳給回呼函式 distanceCalculator()
        cb(res[0], res[1]);
      })
      .catch((err) => {
        process.loadingGpsPunch = false;
        console.error(err);
      });
  }
}
/*
function distanceCalculator 功能：檢查打卡地點與公司距離
本專案使用 Google Distance Matrix Service API
Google 官方文件：https://developers.google.com/maps/documentation/javascript/distancematrix?hl=zh-tw#distance_matrix_parsing_the_results
檢查結果若距離小於等於四百公尺，就調用函式 gpsPunch() 發送打卡請求。
*/
async function distanceCalculator(latlng1, latlng2) {
  // origins (必要)：計算距離和時間時要做為起點的陣列，在此假設為公司所在經緯度。
  var origin1 = new google.maps.LatLng(
    import.meta.env.VITE_LATLNG_TITAN_1,
    import.meta.env.VITE_LATLNG_TITAN_2
  );
  var origin2 = "Taiwan";
  var destinationA = "Taiwan";
  var destinationB = new google.maps.LatLng(latlng1, latlng2);

  var service = new google.maps.DistanceMatrixService();
  await service.getDistanceMatrix(
    {
      origins: [origin1, origin2],
      destinations: [destinationA, destinationB],
      travelMode: "DRIVING",
      unitSystem: google.maps.UnitSystem.METRIC,
    },
    callback
  );
  function callback(response) {
    window.distanceNumber = Number(
      response.rows[0].elements[1].distance.text.split(" ")[0]
    );
    window.distanceUnit =
      response.rows[0].elements[1].distance.text.split(" ")[1];
    console.info(window.distanceNumber, window.distanceUnit);
  }
  if (
    (window.distanceNumber <= 400 && window.distanceUnit === "公尺") ||
    (window.distanceNumber <= 0.4 && window.distanceUnit === "公里")
  ) {
    // 發送打卡請求
    gpsPunch();
  } else {
    process.loadingGpsPunch = false;
    toasterError.show(
      "你與公司的距離大於 400 公尺，或者無法確認，因此不能打卡。"
    );
  }
}

// 向伺服器發出打卡請求
function gpsPunch() {
  fetch(`${import.meta.env.VITE_BASE_URL}/api/punches`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      process.loadingGpsPunch = false;
      toasterInfo.show(res.message);
    })
    .catch((err) => {
      process.loadingGpsPunch = false;
      console.error(err);
    });
}
</script>
