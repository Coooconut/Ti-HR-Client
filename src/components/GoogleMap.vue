<template>
  <div id="button-container">
    <button class="btn btn-primary mx-2 mb-3" @click.prevent="findUser">
      確認現在位置
    </button>
    <button class="btn btn-warning mx-2 mb-3" @click.prevent="findCompany">
      確認公司位置
    </button>
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
      toasterInfo.show("定位中，請耐心等候結果。");
      const promise = new Promise(function (resolve) {
        // 使用瀏覽器的定位功能
        navigator.geolocation.getCurrentPosition(function (position) {
          const latlng1 = position.coords.latitude;
          const latlng2 = position.coords.longitude;
          resolve({ lat: latlng1, lng: latlng2 });
        });
      });
      promise.then((res) => {
        this.center = res;
        this.markers[1].position = res;
        toasterInfo.show("定位程序結束");
      });
    },
  },
};
</script>
