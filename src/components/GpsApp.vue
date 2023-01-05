<template>
  <div class="gps-app">
    <button
      class="btn btn-success"
      @click.prevent="userPosition(distanceCalculator)"
    >
      打卡
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { createToaster } from "@meforma/vue-toaster";
import useAuthStore from "../stores/auth";
const auth = useAuthStore();
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

let response = ref(null);

// 偵測使用者所在位置，回呼函式代入計算所在位置與公司距離的函式 distanceCalculator()
function userPosition(cb) {
  if (!auth.token) {
    toasterError.show("你尚未登入，登入後才能打卡。");
  } else if (auth.token) {
    fetch(
      `https://www.googleapis.com/geolocation/v1/geolocate?key=
        ${import.meta.env.VITE_GOOGLE_MAP_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        response.value = res;
        console.log(res.location.lat, res.location.lng);
        console.log(
          "import.meta.env.VITE_LATLNG_HOME",
          import.meta.env.VITE_LATLNG_HOME_1,
          import.meta.env.VITE_LATLNG_HOME_2
        );
        cb(res.location.lat, res.location.lng);
      })
      .catch((err) => {
        console.error(err);
      });
  }
}

/*
function distanceCalculator 功能：檢查打卡地點與公司距離
本專案使用 Google Distance Matrix Service API
Google 官方文件：https://developers.google.com/maps/documentation/javascript/distancematrix?hl=zh-tw#distance_matrix_parsing_the_results
檢查結果若距離小於等於四百公尺，就調用函式 gpsPunch()
*/
async function distanceCalculator(latlng1, latlng2) {
  // origins (必要)：計算距離和時間時要做為起點的陣列，在此假設為公司所在經緯度。
  var origin1 = new google.maps.LatLng(
    import.meta.env.VITE_LATLNG_HOME_1,
    import.meta.env.VITE_LATLNG_HOME_2
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
    gpsPunch();
  } else {
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
      toasterInfo.show(res.message);
    })
    .catch((err) => {
      console.error(err);
    });
}
</script>
