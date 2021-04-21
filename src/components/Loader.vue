<template>
  <b-modal :active="!loaded || Boolean(error)" :can-cancel="false">
    <div id="loading">
      <div
        class="is-flex is-justify-content-center is-align-content-center is-align-items-center is-align-self-center"
        id="loading-flex"
      >
        <div class="loading-inner">
          <div id="loading-icons" v-if="!loaded">
            <b-icon
              :icon="`wifi-strength-${iconStrength}`"
              size="is-medium"
              pack="mdi"
            >
            </b-icon
            ><br />
            <b-icon icon="coffee" size="is-large"> </b-icon>
          </div>
          <div id="error-icons" v-if="error">
            <b-icon icon="wifi-strength-off" size="is-medium" pack="mdi">
            </b-icon
            ><br />
            <b-icon icon="coffee" size="is-large"> </b-icon>
          </div>
          <br />
          <p v-if="!loaded">Loading, please wait...</p>
          <p v-if="error">
            Sorry, an error occured. Try again later<br />{{ error }}
          </p>
        </div>
      </div>
    </div>
  </b-modal>
</template>
<script>
var ICON_LEVELS = ["outline", "1", "2", "3", "4"];
export default {
  name: "Loader",
  data: function() {
    return {
      iconStrength: "4",
      interval: undefined,
      loaded: true,
      error: false,
    };
  },
  created: function() {
    this.axios.interceptors.request.use((config) => {
      this.loaded = false;
      return config;
    }, this.errorHandler);
    this.axios.interceptors.response.use((response) => {
      this.loaded = true;
      return response;
    }, this.errorHandler);
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
    errorHandler: function(error) {
      this.error = error;
      this.loaded = true;
      return Promise.reject(error);
    },
  },
  watch: {
    loaded: function() {
      if (this.loaded) {
        window.clearInterval(this.interval);
      } else {
        window.setInterval(() => {
          this.updateStrength();
        }, 200);
      }
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
.loading-inner {
  text-align: center;
}
</style>
