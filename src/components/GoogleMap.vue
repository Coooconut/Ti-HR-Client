<template>
  <div id="button-container">
    <button class="btn btn-primary mx-2 mb-2" @click.prevent="findUser">
      確認現在位置
    </button>
    <button class="btn btn-warning mx-2 mb-2" @click.prevent="findCompany">
      確認公司位置
    </button>
  </div>
  <div class="spinner mb-3" v-if="this.process.loadingUserPosition === true">
    <div class="spinner-border text-success mt-2 mx-2" role="status"></div>
    <span>正在定位，請暫時停止任何操作。</span>
  </div>
  <GMapMap
    :center="center"
    :zoom="15"
    map-type-id="terrain"
    style="width: 50vw; height: 50vh"
  >
    <GMapMarker
      :key="marker.id"
      v-for="marker in markers"
      :position="marker.position"
    />
  </GMapMap>
</template>

<script>
import useProcessStore from "../stores/process";
import { createToaster } from "@meforma/vue-toaster";

const toasterInfo = createToaster({
  type: "info",
  position: "top",
  duration: 5000,
});

export default {
  name: "GoogleMap",
  data() {
    return {
      center: {
        lat: 25.05756263191021,
        lng: 121.61238726873873,
      },
      markers: [
        {
          id: "TitanSoft",
          position: {
            lat: 25.05756263191021,
            lng: 121.61238726873873,
          },
        },
        {
          id: "User",
          position: {
            lat: null,
            lng: null,
          },
        },
      ],
      process: useProcessStore(),
    };
  },
  methods: {
    findCompany() {
      this.center = {
        lat: 25.05756263191021,
        lng: 121.61238726873873,
      };
    },
    findUser() {
      this.process.loadingUserPosition = true;
      const promise = new Promise(function (resolve) {
        // 使用瀏覽器的定位功能
        navigator.geolocation.getCurrentPosition(function (position) {
          const latlng1 = position.coords.latitude;
          const latlng2 = position.coords.longitude;
          resolve({ lat: latlng1, lng: latlng2 });
        });
      });
      promise
        .then((res) => {
          this.center = res;
          this.markers[1].position = res;
          this.process.loadingUserPosition = false;
        })
        .catch((err) => {
          this.process.loadingUserPosition = false;
          console.error(err);
        });
    },
  },
};
</script>
