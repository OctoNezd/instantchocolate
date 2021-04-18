<template>
  <div class="softwaresummary">
    <div class="media">
      <div class="media-left">
        <figure class="image is-48x48">
          <b-skeleton v-if="skeleton" width="48" height="48" />
          <IconDisplay v-else :src="software.icon" />
        </figure>
      </div>
      <div class="media-content">
        <b-skeleton size="is-large" v-if="skeleton"></b-skeleton>
        <p class="title is-4" v-else-if="software.displayname != ''">
          {{ software.displayName }}
        </p>
        <b-skeleton v-if="skeleton"></b-skeleton>
        <p
          v-else
          :class="software.displayName !== '' ? 'subtitle is-6' : 'title is-4'"
        >
          {{ software.packageName }} (version: {{ software.version }})
        </p>
      </div>
    </div>
    <div class="is-flex flex-direction-row is-justify-content-space-between">
      <SoftwareAddButton
        :package="software.packageName"
        v-if="showToggleButton"
      />
      <div
        class=""
        v-if="!skeleton && showToggleButton && softwareCatalog && replacement"
      >
        <a @click="swap">
          <b-icon icon="swap-horizontal-circle-outline" size="is-small" />
          Swap for {{ replacement.displayName }}
        </a>
      </div>
    </div>
    <div class="content" v-if="!nodescription">
      <b-skeleton v-if="skeleton" :count="3"></b-skeleton>
      <p v-else-if="software.summary !== ''">
        {{ software.summary }}
      </p>
    </div>
  </div>
</template>
<script>
import SoftwareAddButton from "./SoftwareAddButton.vue";
import IconDisplay from "./IconDisplay.vue";
import { EventBus } from "@/eventBus.js";
export default {
  name: "SoftwareSummary",
  components: { SoftwareAddButton, IconDisplay },
  props: {
    software: Object,
    skeleton: Boolean,
    nodescription: Boolean,
    showToggleButton: Boolean,
    softwareCatalog: Array,
  },
  data: function() {
    if (this.softwareCatalog) {
      return {
        replacement: this.findPackage(this.software.packageName + ".install"),
      };
    } else {
      return {};
    }
  },
  methods: {
    findPackage: function(packageName) {
      // https://stackoverflow.com/a/13964186
      return this.softwareCatalog.filter((obj) => {
        return obj.packageName === packageName;
      })[0];
    },
    swap: function() {
      console.log("swapping");
      this.$installQueue[
        this.$installQueue.indexOf(this.software.packageName)
      ] = this.replacement.packageName;
      EventBus.$emit("installQueueChanged");
    },
  },
};
</script>
<style>
.software-icon {
  position: absolute;
  margin: auto;
  top: 0;
  bottom: 0;
}
.softwaresummary .media {
  align-items: stretch;
}
.softwaresummary .image {
  min-height: 100%;
}
.softwaresummary {
  padding-bottom: 1em;
}
</style>
