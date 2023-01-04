<template>
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
      ],
    };
  },
};
</script>
