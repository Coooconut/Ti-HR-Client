<template>
  <div id="button-container">
    <button class="btn btn-primary" @click.prevent="findUser">
      確認現在位置
    </button>
    <button class="btn btn-warning" @click.prevent="findCompany">
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
          this.center = {
            lat: res.location.lat,
            lng: res.location.lng,
          };
          this.markers[1].position = {
            lat: res.location.lat,
            lng: res.location.lng,
          };
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
};
</script>
