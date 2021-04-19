<template>
  <img
    class="software-icon"
    v-if="!fallback"
    :src="finalUrl"
    @error="fallback = true"
    alt="Software icon"
  />
  <object
    v-else
    type="image/svg+xml"
    width="100%"
    height="100%"
    :data="require('../assets/placeholder.svg')"
  ></object>
</template>
<script>
export default {
  name: "IconDisplay",
  props: ["src", "software"],
  data: function() {
    var finalUrl = this.src;
    var fallback = false;
    if (this.src === undefined && this.software !== undefined) {
      finalUrl = this.software.icon;
    } else if (this.src === undefined && this.software === undefined) {
      finalUrl = "";
      fallback = true;
    }
    return { fallback: fallback, finalUrl: finalUrl };
  },
};
</script>
