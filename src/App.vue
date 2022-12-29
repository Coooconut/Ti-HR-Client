<template>
  <!-- Page Navbar -->
  <page-navbar
    :token="token"
    :employee_id="employee_id"
    @emit-post-punch="postPunch"
    @emit-get-2d-code="get2dCode"
  ></page-navbar>
  <!-- Header -->
  <header>
    <h4>XXX，你好。今天也是個美好的一天。</h4>
    <h4>你的打卡狀態：未打卡</h4>
  </header>
  <div name="dev">
    <h1>{{ message }}</h1>
    <button @click="position">GPS定位</button>
    <button @click="distanceCalculator">計算距離</button>
    <h6>token: {{ token }}</h6>
    <h6>App.vue.response: {{ response }}</h6>
    <h6>App.vue.employee_id: {{ employee_id }}</h6>
  </div>
  <!-- 登入表單 -->
  <sign-in-form :response="response" @emit-sign-in="signIn"></sign-in-form>
  <!-- 更改密碼表單 -->
  <change-password-form
    :token="token"
    @emit-change-password="changePassword"
  ></change-password-form>
  <!-- 二維碼 -->
  <two-d-code
    :token="token"
    :two_d_code="two_d_code"
    @emit-get-2d-code="get2dCode"
  ></two-d-code>
  <!-- GoogleMap -->
  <google-map></google-map>
</template>

<script>
import { RouterLink, RouterView } from "vue-router";
import ChangePasswordForm from "./components/ChangePasswordForm.vue";
import PageNavbar from "./components/PageNavbar.vue";
import SignInForm from "./components/SignInForm.vue";
import TwoDCode from "./components/TwoDCode.vue";
import GoogleMap from "./components/GoogleMap.vue";

export default {
  name: "App",
  components: {
    ChangePasswordForm,
    PageNavbar,
    SignInForm,
    TwoDCode,
    GoogleMap,
  },
  data() {
    return {
      employee_id: null,
      message: null,
      response: null,
      token: null,
      two_d_code: null,
    };
  },
  methods: {
    changePassword(res) {
      this.message = res.message;
      this.response = res;
    },
    get2dCode() {
      if (!this.two_d_code) {
        fetch(
          `http://localhost:8000/api/employees/:${this.employee_id}/2d_code`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          }
        )
          .then((res) => {
            return res.json();
          })
          .then((res) => {
            this.two_d_code = res.punchCode;
          })
          .catch((err) => {
            console.error(err);
          });
      }
    },
    // 本專案使用 Google Distance Matrix Service API
    // https://developers.google.com/maps/documentation/javascript/distancematrix?hl=zh-tw#distance_matrix_parsing_the_results
    distanceCalculator() {
      // origins (必要)：計算距離和時間時要做為起點的陣列，在此假設為公司所在經緯度。
      var origin1 = new google.maps.LatLng(
        import.meta.env.VITE_LATLNG_TITAN_1,
        import.meta.env.VITE_LATLNG_TITAN_2
      );
      var origin2 = "Taiwan";
      var destinationA = "Taiwan";
      var destinationB = new google.maps.LatLng(
        import.meta.env.VITE_LATLNG_HOME_1,
        import.meta.env.VITE_LATLNG_HOME_2
      );

      var service = new google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [origin1, origin2],
          destinations: [destinationA, destinationB],
          travelMode: "DRIVING",
          unitSystem: google.maps.UnitSystem.METRIC,
        },
        callback
      );

      function callback(response, status) {
        // See Parsing the Results for
        // the basics of a callback function.
        console.log(response);
        console.log("distance", response.rows[0].elements[1].distance.text);
        console.log("status ==== ", status);
      }
    },
    // 瀏覽器GPS定位
    position() {
      if (navigator.geolocation) {
        console.log("瀏覽器啟用地理位置功能");
        fetch(
          `https://www.googleapis.com/geolocation/v1/geolocate?key=
        ${import.meta.env.VITE_GOOGLE_MAP_API_KEY}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            // body: gps,
          }
        )
          .then((res) => {
            return res.json();
          })
          .then((res) => {
            this.response = res;
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        alert("你的裝置不支援地理位置功能");
      }
    },
    postPunch(res) {
      this.message = res.message;
      this.response = res;
    },
    signIn(res) {
      this.employee_id = res.data.employee.code;
      this.message = res.message;
      this.response = res;
      this.token = res.data.token;
    },
  },
};
</script>

<style></style>
