<template>
  <!-- Page Navbar -->
  <page-navbar
    :token="token"
    :employee_id="employee_id"
    @emit-post-punch="postPunch"
    @emit-user-position="userPosition"
    @emit-get-user-ip="getUserIP"
  ></page-navbar>
  <!-- Main -->
  <main>
    <!-- Header -->
    <header>
      <h4>{{ full_name }}你好。今天也是個美好的一天。</h4>
    </header>
    <div name="dev">
      <h1>{{ message }}</h1>
      <p>App.vue.response: {{ response }}</p>
    </div>
    <!-- 登入表單 -->
    <sign-in-form :response="response" @emit-sign-in="signIn"></sign-in-form>
    <!-- 更改密碼表單 -->
    <change-password-form
      :token="token"
      @emit-change-password="changePassword"
    ></change-password-form>
    <!-- 二維碼 -->
    <two-d-code :two_d_code="two_d_code"></two-d-code>
    <!-- Pagination -->
    <punch-table
      :count="count"
      :data="data"
      :page_sum="page_sum"
      :page_current="page_current"
    ></punch-table>
    <!-- getPunches -->
    <button class="btn btn-primary" @click="getPunches">查閱打卡記錄</button>
    <paginate
      v-model="page"
      :page-count="page_sum"
      :page-range="20"
      :click-handler="getPunches"
      :prev-text="'Prev'"
      :next-text="'Next'"
      :container-class="'pagination'"
    ></paginate>
    <!-- GoogleMap -->
    <google-map />
  </main>
</template>

<script>
import { RouterLink, RouterView } from "vue-router";
import Paginate from "vuejs-paginate-next";
import ChangePasswordForm from "./components/ChangePasswordForm.vue";
import PageNavbar from "./components/PageNavbar.vue";
import PunchTable from "./components/PunchTable.vue";
import SignInForm from "./components/SignInForm.vue";
import TwoDCode from "./components/TwoDCode.vue";
import GoogleMap from "./components/GoogleMap.vue";

export default {
  name: "App",
  components: {
    ChangePasswordForm,
    PageNavbar,
    PunchTable,
    SignInForm,
    TwoDCode,
    GoogleMap,
    Paginate,
  },
  data() {
    return {
      count: null,
      page_current: 1,
      page_sum: null,
      data: null,
      distance: null,
      employee_id: null,
      full_name: null,
      message: null,
      response: null,
      token: null,
      two_d_code: null,
      user_ip: null,
      user_latlng_1: null,
      user_latlng_2: null,
    };
  },
  methods: {
    changePassword(res) {
      this.message = res.message;
      this.response = res;
    },
    getPunches() {
      this.page_current = this.page;
      fetch(
        `${import.meta.env.VITE_BASE_URL}/api/punches?` +
          new URLSearchParams({
            page: this.page_current,
          }),
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then((res) => {
          this.response = res;
          this.message = res.message;
          this.count = res.count;
          this.data = res.data;
          this.page_sum = Math.ceil(this.count / 10);
        });
    },
    getUserIP() {
      fetch("https://api.ipify.org?format=json")
        .then((res) => res.json())
        .then(({ ip }) => {
          this.user_ip = ip;
          this.show2dCode();
        });
    },
    show2dCode() {
      if (!this.two_d_code) {
        fetch(`${import.meta.env.VITE_BASE_URL}/api/employees/2d_code_auth`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
          },
          body: `userIP=${this.user_ip}`,
        })
          .then((res) => {
            return res.json();
          })
          .then((res) => {
            this.two_d_code = res.punchCode;
            this.message = res.message;
            this.response = res;
          })
          .catch((err) => {
            console.error(err);
          });
      }
    },
    userPosition() {
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
          this.response = res;
          this.user_latlng_1 = res.location.lat;
          this.user_latlng_2 = res.location.lng;
          this.distanceCalculator(res.location.lat, res.location.lng);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    gpsPunch(distance) {
      if (distance <= 0.4) {
        fetch(`${import.meta.env.VITE_BASE_URL}/api/punches`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        })
          .then((res) => {
            return res.json();
          })
          .then((res) => {
            this.postPunch(res);
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        this.message =
          "你與公司的距離大於 0.4 公里，或者無法確認，因此不能打卡。";
      }
    },
    /*
    檢查打卡地點與公司距離。本專案使用 Google Distance Matrix Service API。
    Google 官方文件：https://developers.google.com/maps/documentation/javascript/distancematrix?hl=zh-tw#distance_matrix_parsing_the_results
    */
    async distanceCalculator(latlng1, latlng2) {
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
        window.distance = Number(
          response.rows[0].elements[1].distance.text.split(" ")[0]
        );
      }
      this.gpsPunch(window.distance);
    },
    postPunch(res) {
      this.message = res.message;
      this.response = res;
    },
    signIn(res) {
      this.employee_id = res.data.employee.code;
      this.full_name = res.data.employee.fullName;
      this.message = res.message;
      this.response = res;
      this.token = res.data.token;
    },
  },
};
</script>

<style></style>
