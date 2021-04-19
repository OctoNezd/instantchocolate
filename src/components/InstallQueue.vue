<template>
  <div
    id="installqueue"
    :class="{ pinned: pinned }"
    class="background"
    v-show="installQueue.length > 0"
  >
    <div class="container is-fluid">
      <div class="iq-container is-flex is-align-items-center column-mobile">
        <b-icon icon="coffee" type="is-chocolate" size="is-large" />
        <p class="spacer" />
        <div class="text">
          <p class="title is-4">
            You have {{ installQueue.length }} packages waiting to install
          </p>
          <p class="subtitle">
            <span
              v-for="(software, index) in installQueue.slice(0, 5)"
              :key="software"
              >{{ findPackage(software).displayName
              }}<span v-if="!(index === installQueue.length - 1 || index === 4)"
                >,
              </span></span
            >
            <span v-if="installQueue.length > 5">...</span>
          </p>
        </div>
        <div id="install">
          <b-button
            type="is-dark"
            @click="$emit('toggleInstallInstructions')"
            >{{ buttonText }}</b-button
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "InstallQueue",
  props: {
    softwarelist: Array,
    pinned: Boolean,
    buttonText: String,
    installQueue: Array,
  },
  methods: {
    findPackage: function(packageName) {
      // https://stackoverflow.com/a/13964186
      return this.softwarelist.filter((obj) => {
        return obj.packageName === packageName;
      })[0];
    },
  },
};
</script>
<style lang="scss">
.pinned {
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
  overflow: hidden;
  box-shadow: 0px -5px 30px 0px var(--shadowColor);
}
.iq-container {
  padding-top: 1em !important;
  padding-bottom: 1em !important;
  overflow: hidden;
}
#install {
  flex-grow: 1;
  text-align: right;
}
</style>
