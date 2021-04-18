<template>
  <div id="loading">
    <div
      class="is-flex is-justify-content-center is-align-content-center is-align-items-center is-align-self-center"
      id="loading-flex"
    >
      <div class="loading-inner">
        <div id="loading-icons">
          <b-icon
            :icon="`wifi-strength-${iconStrength}`"
            size="is-medium"
            pack="mdi"
          >
          </b-icon
          ><br />
          <b-icon icon="coffee" size="is-large"> </b-icon>
        </div>
        <br />
        Loading, please wait...
      </div>
    </div>
  </div>
</template>
<script>
var ICON_LEVELS = ["outline", "1", "2", "3", "4"];
export default {
  name: "Loader",
  data: function() {
    return { iconStrength: "4" };
  },
  created: function() {
    window.setInterval(() => {
      this.updateStrength();
    }, 200);
  },
  methods: {
    updateStrength: function() {
      var currentIdx = ICON_LEVELS.indexOf(this.iconStrength);
      var newIdx = currentIdx + 1;
      if (newIdx >= ICON_LEVELS.length) {
        newIdx = 0;
      }
      this.iconStrength = ICON_LEVELS[newIdx];
    },
  },
};
</script>
<style>
#loading {
  color: white;
}
#loading-flex {
  height: 100%;
}
#loading-icons {
  text-align: center;
}
</style>
