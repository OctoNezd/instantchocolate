<template>
  <img
    class="software-icon"
    v-if="!fallback"
    :src="src"
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
  props: ["src"],
  data: function() {
    return { fallback: false };
  },
};
</script>
