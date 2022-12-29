<template>
  <GMapMap
    :center="center"
    :zoom="7"
    map-type-id="terrain"
    style="width: 60vw; height: 40vw"
  >
  </GMapMap>
</template>

<script>
export default {
  name: "GoogleMap",
  data() {
    return {
      center: { lat: 51.093048, lng: 6.84212 },
    };
  },
};
</script>
